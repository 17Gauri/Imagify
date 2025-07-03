import axios from 'axios';
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [credit, setCredit] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  console.log("✅ BACKEND URL in context:", backendUrl);

  // 🔁 Load user credits
  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
        console.log("💳 Loaded credits:", data.credits);
      } else {
        toast.error(data.message || "Unable to fetch credits.");
      }
    } catch (error) {
      console.log("🔴 Auto login failed:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } else {
        toast.error(error.message || "Something went wrong");
      }
    }
  };

  // 🧠 Generate AI image using credits
  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message || "Failed to generate image");
        loadCreditsData();

        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.log("❌ generateImage error:", error);

      if (error.response && error.response.status === 403) {
        toast.error("No credits left.");
        loadCreditsData();
        navigate("/buy");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    }
  };

  // 💳 Razorpay Payment
  const initiatePayment = async (planId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/payment`,
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Imagify",
        description: "Buy credits",
        order_id: order.id,
        handler: async function (response) {
          console.log("✅ Razorpay response:", response);
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/user/verify-payment`,
              response,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment verified! Credits added.");
              loadCreditsData();
            } else {
              toast.error(verifyRes.data.message || "Payment verification failed.");
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            toast.error("Server error during payment verification.");
          }
        },
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("💥 Razorpay Init Error:", error);
      toast.error("Failed to initiate payment.");
    }
  };

  // 🚪 Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const value = {
    user, setUser,
    showLogin, setShowLogin,
    backendUrl,
    token, setToken,
    credit, setCredit,
    loadCreditsData,
    generateImage,
    initiatePayment, // ✅ added to context
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
