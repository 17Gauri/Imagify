import userModel from "../models/usermodel.js";
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("🧠 userId from token:", userId);

    const { prompt } = req.body;

    // ⚠️ Validate input
    if (!userId || !prompt) {
      return res.status(400).json({ success: false, message: "Missing user or prompt" });
    }

    // 🔍 Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("🔍 Fetched user:", user.email, "Current credits:", user.creditBalance);

    // 💳 Check credit balance
    if (user.creditBalance <= 0) {
      return res.status(403).json({
        success: false,
        message: "No credit balance left",
        creditBalance: user.creditBalance,
      });
    }

    // 🔑 Ensure API key is present
    if (!process.env.CLIPDROP_API) {
      return res.status(500).json({
        success: false,
        message: "ClipDrop API key is missing in environment variables",
      });
    }

    // 🌐 Call ClipDrop API
    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    // 🖼️ Convert result to base64
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // 🧾 Deduct credit
    user.creditBalance -= 1;
    const savedUser = await user.save();

    console.log("💾 Credit deducted. New balance:", savedUser.creditBalance);

    // ✅ Respond to frontend
    return res.json({
      success: true,
      message: "Image generated successfully",
      resultImage,
      creditBalance: savedUser.creditBalance,
    });

  } catch (error) {
    console.error("❌ Error in generateImage:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
