// --- File: Orders.jsx ---

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets'; // removed dummyOrders as it's not used
import toast from 'react-hot-toast';

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/seller');
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-white">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-black">Orders List</h2>
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex md:flex-row flex-col gap-4 items-start justify-between p-4 max-w-4xl rounded-md border border-gray-300 shadow-sm"
          >
            {/* Left: Product Info */}
            <div className="flex gap-3 w-full md:max-w-[200px]">
              <img
                className="w-8 h-8 object-contain mt-1"
                src={assets.box_icon}
                alt="boxIcon"
              />
              <div className="flex flex-col text-sm text-black font-medium">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {/* Use optional chaining here */}
                    {item.product?.name || 'Deleted Product'}{' '}
                    <span className="text-green-600 font-semibold text-sm">x {item.quantity}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Middle: Address */}
            <div className="text-xs md:text-sm text-black flex-1 min-w-[160px]">
              {/* Use optional chaining for all address fields */}
              <p className="font-semibold">{order.address?.firstName} {order.address?.lastName}</p>
              <p>{order.address?.street}, {order.address?.city}</p>
              <p>{order.address?.state}, {order.address?.zipcode}, {order.address?.country}</p>
              <p>{order.address?.phone}</p>
            </div>

            {/* Right: Payment Info */}
            <div className="flex flex-col items-start md:items-end text-xs md:text-sm text-black min-w-[120px]">
              <p className="text-black font-semibold text-base mb-1">{currency}{order.amount}</p>
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Payment: {order.isPaid ? 'Paid' : 'Pending'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;