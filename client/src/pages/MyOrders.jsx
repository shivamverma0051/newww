// --- File: MyOrders.jsx ---

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className='mt-16 pb-16'>
      <div className='flex flex-col items-end w-max mb-8'>
        <p className='text-2xl font-medium uppercase'>My Orders</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {myOrders.map((order) => ( // Renamed index to avoid conflict
        <div key={order._id} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
          <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
            <span>Order ID: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: {currency} {order.amount}</span>
          </p>
          {order.items.map((item, itemIndex) => (
            <div key={item._id || itemIndex}
              className={`relative bg-white text-gray-500/70 ${
                order.items.length !== itemIndex + 1 ? "border-b" : "" // Corrected border class
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>

              <div className='flex items-center mb-4 md:mb-0'>
                <div className='bg-primary/10 p-4 rounded-lg'>
                  {/* ✅ FIX: Use optional chaining for the image */}
                  <img 
                    src={item.product?.image?.[0] || 'https://via.placeholder.com/150'} // Fallback image
                    alt={item.product?.name || "Product image"} 
                    className='w-16 h-16 object-contain' // Added object-contain
                  />
                </div>
                <div className='ml-4'>
                  {/* ✅ FIX: Use optional chaining for name and category */}
                  <h2 className='text-xl font-medium text-gray-800'>{item.product?.name || "Deleted Product"}</h2>
                  <p>Category: {item.product?.category || "N/A"}</p>
                </div>
              </div>

              <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                <p>Quantity: {item.quantity || "1"}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <p className='text-primary text-lg font-medium'>
                {/* ✅ FIX: Use optional chaining for price calculation */}
                Amount: {currency}{(item.product?.offerPrice || 0) * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// The component name was MyOrder, let's keep it consistent with the filename
export default MyOrders; 