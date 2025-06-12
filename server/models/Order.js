// --- File: models/Order.js ---

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // IMPORTANT FIX: Changed type from String to ObjectId for all references
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'product' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'address' },

    // --- No changes below this line ---
    status: { type: String, default: 'Order Placed' },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;