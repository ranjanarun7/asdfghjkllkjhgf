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
    // If backend sends { items: [...] }
    if (Array.isArray(data)) {
        setCart(data);
    } else if (Array.isArray(data.items)) {
        setCart(data.items);
    } else if (Array.isArray(data.cart)) {
        setCart(data.cart);
    } else {
        console.error("Invalid cart format:", data);
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
    if (Array.isArray(updated)) {
    setCart(updated);
} else if (Array.isArray(updated.items)) {
    setCart(updated.items);
} else if (Array.isArray(updated.cart)) {
    setCart(updated.cart);
} else {
    console.error("Invalid cart update:", updated);
}

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
    if (Array.isArray(updated)) {
    setCart(updated);
} else if (Array.isArray(updated.items)) {
    setCart(updated.items);
} else if (Array.isArray(updated.cart)) {
    setCart(updated.cart);
} else {
    console.error("Invalid cart update:", updated);
}

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
    if (Array.isArray(updated)) {
    setCart(updated);
} else if (Array.isArray(updated.items)) {
    setCart(updated.items);
} else if (Array.isArray(updated.cart)) {
    setCart(updated.cart);
} else {
    console.error("Invalid cart update:", updated);
}

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
    if (Array.isArray(updated)) {
    setCart(updated);
} else if (Array.isArray(updated.items)) {
    setCart(updated.items);
} else if (Array.isArray(updated.cart)) {
    setCart(updated.cart);
} else {
    console.error("Invalid cart update:", updated);
}

  };

  const clearCart = () => {
  setCart([]);
};


  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity,clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
