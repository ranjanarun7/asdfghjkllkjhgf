import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId");

  // CHECK LOGIN
  const ensureLogin = () => {
    if (!userId) {
      alert("Please login first!");
      window.location.href = "/login";
      return false;
    }
    return true;
  };

  // LOAD CART
  const fetchCart = () => {
    if (!ensureLogin()) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCart(data);
        } else {
          console.warn("Cart data is not an array, defaulting to empty:", data);
          setCart([]);
        }
      })
      .catch((err) => console.log("Cart fetch error:", err));
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  // ADD
  const addToCart = async (product) => {
    if (!ensureLogin()) return;

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, product }),
    });

    const updated = await res.json();
    setCart(updated);
  };

  // REMOVE
  const removeFromCart = async (productId) => {
    if (!ensureLogin()) return;

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });

    const updated = await res.json();
    setCart(updated);
  };

  // INCREASE
  const increaseQuantity = async (productId) => {
    if (!ensureLogin()) return;

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/increase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });

    const updated = await res.json();
    setCart(updated);
  };

  // DECREASE
  const decreaseQuantity = async (productId) => {
    if (!ensureLogin()) return;

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/decrease`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId }),
    });

    const updated = await res.json();
    setCart(updated);
  };

  const clearCart = () => {
    setCart([]);
  };


  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
