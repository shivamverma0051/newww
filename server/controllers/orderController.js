// --- File: controllers/orderController.js ---

import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import Stripe from "stripe";

// ✅ FIX: Removed duplicate User import from here.

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, addressId } = req.body;

        if (!addressId || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }

        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                amount += product.offerPrice * item.quantity;
            } else {
                return res.status(404).json({ success: false, message: `Product with id ${item.product} not found` });
            }
        }

        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address: addressId,
            paymentType: "COD",
        });

        await User.findByIdAndUpdate(userId, { cartItems: {} });

        return res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.error("Place Order Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Place Order stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, addressId } = req.body;
        const { origin } = req.headers;

        if (!addressId || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }

        let productData = [];
        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                productData.push({
                    name: product.name,
                    price: product.offerPrice,
                    quantity: item.quantity,
                });
                amount += product.offerPrice * item.quantity;
            } else {
                return res.status(404).json({ success: false, message: `Product with id ${item.product} not found` });
            }
        }

        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address: addressId,
            paymentType: "Online",
        });

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = productData.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.floor(item.price * 1.02 * 100)
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/my-orders`, // Redirect directly to my-orders
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        });
        
        // Note: The cart is now cleared in the webhook after successful payment, not here.

        return res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Order Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ THIS ENTIRE FUNCTION IS CORRECTED
// Stripe webhooks to verify payment and clear cart
export const stripeWebhooks = async (request, response) => {
     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
     const sig = request.headers["stripe-signature"];
     let event;

     try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
     } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
     }

     // Handle the event
     switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const { orderId, userId } = session.metadata;
            
            // Mark order as paid
            await Order.findByIdAndUpdate(orderId, { isPaid: true });

            // Clear the user's cart
            await User.findByIdAndUpdate(userId, { cartItems: {} });
            
            console.log(`Order ${orderId} marked as paid and cart cleared for user ${userId}.`);
            break;
        }
     
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
     }
     response.json({ received: true });
}

// get orders by user ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Get User Orders Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get All Orders (for seller/admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
        .populate({
            path: 'items.product',
            model: 'product'
        })
        .populate({
            path: 'address',
            model: 'address'
        })
        .populate({
            path: 'userId',
            model: 'user'
        })
        .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error("Get All Orders Error:", error); 
        res.status(500).json({ success: false, message: "Server Error" });
    }
};