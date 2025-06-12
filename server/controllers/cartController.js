import User from "../models/User.js";

export const updateCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ Use consistent ID from middleware
    const { cartItems } = req.body;

    if (!userId) {
      // This case should ideally not be hit if authUser middleware is used
      return res.status(400).json({ success: false, message: "User ID missing" });
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    res.json({ success: true, message: "Cart Updated" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};