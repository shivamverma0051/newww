import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
    try {
        const userId = req.userId; // ✅ Use consistent ID from middleware
        const { address } = req.body;
        await Address.create({ ...address, userId });
        res.json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAddress = async (req, res) => {
    try {
        const userId = req.userId; // ✅ Use consistent ID from middleware
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, addresses: addresses });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};