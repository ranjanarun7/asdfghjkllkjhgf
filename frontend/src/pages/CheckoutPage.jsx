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

  const generateOrderId = () => {
    return "ORD" + Math.floor(100000 + Math.random() * 900000);
  };

  const handlePlaceOrder = async () => {

  if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
    alert("Fill all fields");
    return;
  }

  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/order/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart, address }),
  });

  const data = await res.json();

  navigate("/payment", {
    state: {
      orderId: data.orderId,
      paymentId: data.paymentId,
      address
    }
  });
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
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
