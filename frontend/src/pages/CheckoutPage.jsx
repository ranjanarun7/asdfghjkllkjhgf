import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Load Razorpay script function
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ⭐ FULL PAYMENT FLOW
  const handlePlaceOrder = async () => {
    console.log("Place Order clicked");

    // 0️⃣ validate address
    if (
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.pincode
    ) {
      alert("Fill all fields");
      return;
    }

    // 0.5️⃣ calculate total amount
    const totalAmount = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    console.log("Cart total:", totalAmount, cart);

    if (totalAmount <= 0) {
      alert("Your cart is empty or amount is 0");
      return;
    }

    // 1️⃣ Load Razorpay SDK
    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay. Please check your internet.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not available on window");
      console.error("window.Razorpay is undefined");
      return;
    }

    try {
      // 2️⃣ Create order from backend
      const orderRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }), // rupees
        }
      );

      console.log("Create-order status:", orderRes.status);

      if (!orderRes.ok) {
        alert("Failed to create order. Check backend logs.");
        return;
      }

      const data = await orderRes.json();
      console.log("Create-order response:", data);

      if (!data.success || !data.order) {
        alert("Order creation error from backend");
        return;
      }

      const options = {
        key: data.key || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Jharkhand Tourism - Order Payment",
        description: "Order Checkout",
        order_id: data.order.id,

        // 3️⃣ Payment success handler
        handler: async function (response) {
          console.log("Razorpay payment response:", response);

          const verifyRes = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/payment/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            }
          );

          const verifyData = await verifyRes.json();
          console.log("Verify response:", verifyData);

          if (verifyData.success) {
            // 4️⃣ Save order to DB after successful payment (optional but good)
            await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/order/confirm`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  cart,
                  address,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                }),
              }
            );

            // 5️⃣ Redirect to success page
            navigate("/order-success", {
              state: {
                address,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              },
            });
          } else {
            alert("Payment verification failed. Try again.");
          }
        },

        prefill: {
          name: address.name,
          email: "customer@example.com",
          contact: address.phone,
        },

        theme: {
          color: "#16A34A",
        },
      };

      console.log("Razorpay options:", options);

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Place order error:", err);
      alert("Something went wrong while placing the order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-green-600 mb-2 text-center">
          Delivery Address
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your details to receive your order
        </p>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street / Area
            </label>
            <input
              type="text"
              name="street"
              placeholder="Apartment, street, area"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              placeholder="Enter postal code"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handlePlaceOrder}
          className="mt-8 w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-200 active:scale-95"
        >
          Place Order & Pay
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;