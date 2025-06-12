// --- File: ProductList.jsx ---

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ProductList = () => {
    const { axios, currency } = useAppContext();
    const [products, setProducts] = useState([]);

    // Function to fetch all products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch products.");
        }
    };

    // Fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    // ✅ THIS IS THE NEW HANDLER FUNCTION TO FIX THE WARNING
    // It updates the stock status on the backend and then updates the UI
    const handleStockChange = async (id, inStock) => {
        try {
            const { data } = await axios.post('/api/product/change-stock', { id, inStock });
            if (data.success) {
                toast.success(data.message);
                // Refresh the product list to show the change
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update stock status.");
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-white">
            <div className="md:p-10 p-4 space-y-4">
                <h2 className="text-sm font-semibold text-black">Product List</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Image</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">In Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="bg-white border-b">
                                    <td className="px-6 py-4">
                                        <img src={product.image[0]} alt={product.name} className="w-12 h-12 object-contain" />
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {product.name}
                                    </th>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">{currency}{product.offerPrice}</td>
                                    <td className="px-6 py-4">
                                        {/* ✅ FIX APPLIED HERE: Added the onChange handler to the checkbox */}
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                                            checked={product.inStock}
                                            onChange={(e) => handleStockChange(product._id, e.target.checked)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;