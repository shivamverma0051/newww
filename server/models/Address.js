// --- File: models/Address.js ---

import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    // IMPORTANT FIX: Changed userId to be an ObjectId reference
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    
    // IMPORTANT FIX: Changed invalid 'mongoose: true' to 'required: true'
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    
    // IMPORTANT FIX: Corrected typo 'strees' to 'street'
    street: { type: String, required: true },
    
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true }, // Changed to String for better handling of formats like '01234'
    country: { type: String, required: true },
    phone: { type: String, required: true },
}, { timestamps: true });

const Address = mongoose.models.address || mongoose.model('address', addressSchema);

export default Address;