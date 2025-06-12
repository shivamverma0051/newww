import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard"; // Ensure this path is correct for your project structure

const ProductDetails = () => {
    const { products: productsFromContext, navigate, currency, addToCart } = useAppContext();
    // Assuming your route is like /products/:category/:id or /products/somepath/:id
    // where 'id' is the actual product ID.
    const { id: productIdFromUrl } = useParams(); 

    
    const [currentProduct, setCurrentProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // General loading state for this component

    useEffect(() => {
    console.log("ProductDetails EFFECT 1: Running...");
    console.log("ProductDetails EFFECT 1: productIdFromUrl from useParams:", productIdFromUrl);
    console.log("ProductDetails EFFECT 1: productsFromContext available?", !!productsFromContext, "Length:", productsFromContext?.length);

    if (productsFromContext && productsFromContext.length > 0 && productIdFromUrl) {
        console.log("ProductDetails EFFECT 1: Attempting to find product with ID:", productIdFromUrl);
        // Log a few _id's from the context to compare
        if (productsFromContext.length > 0) {
            console.log("ProductDetails EFFECT 1: Sample _id from context:", productsFromContext[0]?._id);
        }

        const foundProduct = productsFromContext.find(item => item._id === productIdFromUrl);
        console.log("ProductDetails EFFECT 1: Product found?", !!foundProduct, foundProduct);
        
        setCurrentProduct(foundProduct); 
        setIsLoading(false); 
    } else if (!productsFromContext || productsFromContext.length === 0) {
        console.log("ProductDetails EFFECT 1: productsFromContext not ready or empty, or no productIdFromUrl.");
        setIsLoading(true); // Keep loading if products aren't there yet
    } else { 
        console.log("ProductDetails EFFECT 1: Fallback - setting currentProduct to null, isLoading to false.");
        setCurrentProduct(null);
        setIsLoading(false); 
    }
}, [productsFromContext, productIdFromUrl]);

    useEffect(() => {
        // This effect runs when the currentProduct state changes.
        // It sets the thumbnail and related products.
        if (currentProduct) {
            // Set thumbnail
            if (currentProduct.image && currentProduct.image.length > 0) {
                setThumbnail(currentProduct.image[0]);
            } else {
                // Fallback if product has no images (or use a placeholder from assets)
                setThumbnail(assets.upload_area || "https://via.placeholder.com/300"); 
            }

            // Set related products
            if (productsFromContext && productsFromContext.length > 0) {
                const filtered = productsFromContext
                    .filter(p => p.category === currentProduct.category && p._id !== currentProduct._id)
                    .slice(0, 4); // Show up to 4 related products
                setRelatedProducts(filtered);
            }
        } else {
            // Reset if no current product
            setThumbnail(null);
            setRelatedProducts([]);
        }
    }, [currentProduct, productsFromContext]);

    if (isLoading) {
        return (
            <div className="mt-12 text-center py-10">
                <p className="text-xl text-gray-600">Loading product details...</p>
            </div>
        );
    }

    if (!currentProduct) {
        return (
            <div className="mt-12 text-center py-10">
                <p className="text-xl text-gray-600">Product not found.</p>
                <Link to="/products" className="text-indigo-600 hover:underline">Go to All Products</Link>
            </div>
        );
    }

    // If we reach here, currentProduct is found and loaded.
    // Alias currentProduct to 'product' for consistency with your original JSX.
    const product = currentProduct;

    return (
        <div className="mt-12">
            <p>
                <Link to={"/"}>Home</Link> /
                <Link to={"/products"}> Products</Link> /
                <Link to={`/products/${product.category?.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-indigo-500"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-4"> {/* Adjusted gap for smaller screens */}
                <div className="flex flex-col sm:flex-row gap-3"> {/* Adjusted layout for thumbnails and main image */}
                    <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0"> {/* Thumbnails scrollable on small screens */}
                        {Array.isArray(product.image) && product.image.map((image, index) => (
                            <div 
                                key={index} 
                                onClick={() => setThumbnail(image)} 
                                className={`border max-w-20 sm:max-w-24 rounded overflow-hidden cursor-pointer shrink-0 ${thumbnail === image ? 'border-indigo-500' : 'border-gray-500/30'}`}
                            >
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-auto object-cover"/>
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 w-full sm:w-auto max-w-xs mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg rounded overflow-hidden flex items-center justify-center order-1 sm:order-2">
                        <img src={thumbnail || (assets.upload_area || "https://via.placeholder.com/400")} alt="Selected product" className="object-contain max-h-[300px] md:max-h-[400px] w-full"/>
                    </div>
                </div>


                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-2xl md:text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                               <img key={`star-${i}`} src={i<4 ? assets.star_icon : assets.star_dull_icon}
                                alt="star rating" className="md:w-4 w-3.5" />
                        ))}
                        <p className="text-base ml-2">(4)</p> {/* Consider making rating dynamic */}
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {Array.isArray(product.description) && product.description.map((desc, index) => (
                            <li key={`desc-${index}`}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={()=>addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button onClick={()=>{addToCart(product._id); navigate("/cart")}} className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-medium mb-6">Related Products</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                        {relatedProducts.map((relatedProd) => (
                            <ProductCard key={relatedProd._id} product={relatedProd} />
                        ))}
                        <button onClick={()=>{navigate('/products'); scrollTo(0,0)}}
                            className="mx-auto cursor-pointer px-12 my-16 py2.5 border rounded 
                            text-primary hover:bg-primary/10 transition">
                            See more</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;