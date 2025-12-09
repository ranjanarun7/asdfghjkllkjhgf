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

  // Payment Status: 'IDLE' | 'PROCESSING' | 'VERIFYING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  const [paymentStatus, setPaymentStatus] = useState("IDLE");

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
    setPaymentStatus("PROCESSING");

    // 0️⃣ validate address
    if (
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.pincode
    ) {
      alert("Fill all fields");
      setPaymentStatus("IDLE");
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
      setPaymentStatus("IDLE");
      return;
    }

    // 1️⃣ Load Razorpay SDK
    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay. Please check your internet.");
      setPaymentStatus("IDLE");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not available on window");
      console.error("window.Razorpay is undefined");
      setPaymentStatus("IDLE");
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
        setPaymentStatus("IDLE");
        return;
      }

      const data = await orderRes.json();
      console.log("Create-order response:", data);

      if (!data.success || !data.order) {
        alert("Order creation error from backend");
        setPaymentStatus("IDLE");
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
          setPaymentStatus("VERIFYING"); // Start showing loading screen

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
            try {
              // 4️⃣ Save order to DB after successful payment
              const userId = localStorage.getItem("userId");
              console.log("Confirming payment with backend...");

              const confirmRes = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/order/confirm-payment`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId,
                    cart,
                    address,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                  }),
                }
              );

              if (!confirmRes.ok) {
                const errText = await confirmRes.text();
                throw new Error(`Server error: ${confirmRes.status} - ${errText}`);
              }

              const confirmData = await confirmRes.json();
              console.log("Confirmation success:", confirmData);

              setPaymentStatus("SUCCESS");

              // 5️⃣ Redirect to success page
              navigate("/order-success", {
                state: {
                  address,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  txHash: confirmData.txHash,
                },
              });
            } catch (error) {
              console.error("Payment confirmation failed:", error);
              setPaymentStatus("FAILED");
            }
          } else {
            console.error("Payment verification failed");
            setPaymentStatus("FAILED");
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

        // Detect modal close
        modal: {
          ondismiss: function () {
            console.log("Payment cancelled or closed");
            // Only set to cancelled if we didn't just succeed
            setPaymentStatus((prev) => (prev === "VERIFYING" || prev === "SUCCESS" ? prev : "CANCELLED"));
          }
        }
      };

      console.log("Razorpay options:", options);

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Place order error:", err);
      setPaymentStatus("FAILED");
    }
  };

  const handleRetry = () => {
    handlePlaceOrder();
  };

  const handleCancelTransaction = () => {
    navigate("/cart");
  };

  // Render Loading / Failure States
  if (paymentStatus === "VERIFYING") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
        <h2 className="text-2xl font-bold text-green-800">Processing Payment...</h2>
        <p className="text-gray-600 mt-2">Generating Transaction Hash on Blockchain.</p>
        <p className="text-gray-500 text-sm mt-1">Please do not close this window.</p>
      </div>
    );
  }

  if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {paymentStatus === "CANCELLED" ? "Transaction Cancelled" : "Payment Failed"}
          </h2>
          <p className="text-gray-500 mb-8">
            {paymentStatus === "CANCELLED"
              ? "You cancelled the payment process."
              : "We couldn't process your payment. Please try again."}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition duration-200"
            >
              Retry Payment
            </button>
            <button
              onClick={handleCancelTransaction}
              className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition duration-200"
            >
              Cancel Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              value={address.name}
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
              value={address.phone}
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
              value={address.street}
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
              value={address.city}
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
              value={address.pincode}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={paymentStatus === "PROCESSING"}
          className={`mt-8 w-full py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-200 
            ${paymentStatus === "PROCESSING" ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:scale-95"}
          `}
        >
          {paymentStatus === "PROCESSING" ? "Processing..." : "Place Order & Pay"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
