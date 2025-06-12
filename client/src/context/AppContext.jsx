import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [addresses, setAddresses] = useState([]); // ✅ Moved address state here

  // ✅ Helper to prevent corrupted cart data from causing errors
  const sanitizeCart = (cart) => {
    if (!cart || typeof cart !== 'object') return {};
    const sanitized = {};
    for (const key in cart) {
      const value = cart[key];
      if (typeof value === 'number' && value > 0) {
        sanitized[key] = Math.floor(value);
      }
    }
    return sanitized;
  };

  // Load cart from localStorage with sanitization
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      try {
        setCartItems(sanitizeCart(JSON.parse(storedCart)));
      } catch (e) {
        localStorage.removeItem("cartItems"); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (Object.keys(cartItems).length > 0 || localStorage.getItem("cartItems")) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);
  
  const getUserAddress = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/api/address/get');
      if (data.success) {
        setAddresses(data.addresses || []);
      } else {
        toast.error(String(data.message));
      }
    } catch (error) {
      toast.error(String(error.message));
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        // Merge server cart with localStorage cart (both sanitized)
        const localCart = sanitizeCart(JSON.parse(localStorage.getItem("cartItems")) || {});
        const serverCart = sanitizeCart(data.user.cartItems || {});
        const mergedCart = { ...localCart, ...serverCart }; // Server cart can overwrite local
        setCartItems(mergedCart);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = (itemId) => {
    setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    toast.success("Added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      if (quantity > 0) newCart[itemId] = quantity;
      else delete newCart[itemId];
      return newCart;
    });
    toast.success("Cart Updated");
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
        const newCart = { ...prev };
        if (newCart[itemId]) {
            delete newCart[itemId];
        }
        return newCart;
    });
    toast.success("Removed from cart");
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        totalAmount += product.offerPrice * cartItems[itemId];
      }
    }
    return totalAmount;
  };
  
  // Sync cart with backend when cartItems or user changes
  useEffect(() => {
    const updateCartOnServer = async () => {
      try {
        await axios.post("/api/cart/update", { cartItems });
      } catch (error) {
         // Silently fail or use a less intrusive toast
         console.error("Failed to sync cart:", error);
      }
    };
    if (user && Object.keys(cartItems).length > 0) {
      updateCartOnServer();
    }
  }, [cartItems, user]);

  // Initial data fetch and subsequent fetches on user change
  useEffect(() => {
    const initialize = async () => {
      await fetchUser();
      await fetchProducts();
    };
    initialize();
  }, []);

  // ✅ Fetch addresses whenever user state changes
  useEffect(() => {
    if (user) {
        getUserAddress();
    } else {
        setAddresses([]); // Clear addresses on logout
    }
  }, [user]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    addresses, // ✅ Expose addresses
    getUserAddress, // ✅ Expose refetch function
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};