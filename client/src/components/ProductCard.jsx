import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    
    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

    const handleProductClick = () => {
        if (product && product.category && product._id) {
            const path = `/products/${product.category.toLowerCase()}/${product._id}`;
            // console.log("ProductCard: Navigating to:", path); // Optional: for debugging
            navigate(path);
            window.scrollTo(0, 0); // Ensure window.scrollTo to refer to the global scrollTo
        } else {
            console.error("ProductCard: Missing product data for navigation", product);
        }
    };

    // Prevent rendering if product is not valid, though usually parent component handles this
    if (!product || !product.image || !product.image[0]) {
        // Or return a placeholder, or null
        // console.warn("ProductCard: Rendering with incomplete product data", product);
        return <div className="border border-gray-500/20 rounded-md p-2 text-xs text-red-500">Invalid product data</div>; 
    }

    return (
        <div 
            onClick={handleProductClick} // Use the handler function
            className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white w-full cursor-pointer" // Added cursor-pointer
        >
            <div className="group flex items-center justify-center px-2"> {/* Removed cursor-pointer here as main div is clickable */}
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36 h-auto object-contain aspect-[4/3]" src={product.image[0]} alt={product.name} /> {/* Added aspect ratio and object-contain */}
            </div>
            <div className="text-gray-500/60 text-sm mt-2"> {/* Added mt-2 for spacing */}
                <p className="text-xs">{product.category}</p> {/* Made category text smaller */}
                <p className="text-gray-700 font-medium text-base md:text-lg truncate w-full" title={product.name}>{product.name}</p> {/* Adjusted text size, added title for full name on hover */}
                <div className="flex items-center gap-0.5 mt-1"> {/* Added mt-1 */}
                    {Array(5).fill('').map((_, i) => (
                        <img key={`star-card-${product._id}-${i}`} className="md:w-3.5 w-3" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="star" />
                    ))}
                    <p className="text-xs ml-1">(4)</p> {/* Adjusted size and margin */}
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-indigo-500">
                        {currency}{product.offerPrice}{" "} {/* Removed extra $ */}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">
                            {currency}{product.price} {/* Removed extra $ */}
                        </span>
                    </p>
                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
                        {!cartItems[product._id] ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 text-xs md:text-sm md:w-[80px] w-[70px] h-[30px] md:h-[34px] rounded " // Adjusted padding/size
                                onClick={() => addToCart(product._id)}
                                title="Add to cart"
                            >
                                <img src={assets.cart_icon} alt="cart" className="w-3 h-3 md:w-4 md:h-4"/> {/* Adjusted icon size */}
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm md:w-20 w-[70px] h-[30px] md:h-[34px] border border-primary/40 rounded select-none"> {/* Added border for consistency */}
                                <button
                                    onClick={() => { removeFromCart(product._id) }}
                                    className="cursor-pointer px-1 md:px-2 h-full text-lg" // Adjusted padding and text size
                                    title="Remove one"
                                >
                                    -
                                </button>
                                <span className="w-4 md:w-5 text-center">{cartItems[product._id]}</span>
                                <button
                                    onClick={() => { addToCart(product._id) }}
                                    className="cursor-pointer px-1 md:px-2 h-full text-lg" // Adjusted padding and text size
                                    title="Add one more"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
