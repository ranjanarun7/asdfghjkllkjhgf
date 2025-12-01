import { useCart } from "../context/CartContext";
import { X } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 150 : 0;
  const tax = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;

  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-10">
          My Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your cart is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT SIDE – PRODUCT CARDS */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-2xl shadow-md p-5 flex gap-6 hover:shadow-lg transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    <p className="text-green-600 font-bold text-lg mt-3">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* RIGHT CONTROLS */}
                  <div className="flex flex-col justify-between items-end">

                    {/* QUANTITY CONTROL */}
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => decreaseQuantity(item.productId)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg"
                      >
                        −
                      </button>

                      <span className="px-4 text-lg font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.productId)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-lg"
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 flex items-center gap-1 text-sm hover:text-red-700 mt-3"
                    >
                      <X size={16} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE – SUMMARY CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit lg:sticky lg:top-24">

              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>
              </div>

              <hr className="my-5" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">₹{total}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold shadow hover:shadow-lg transition-all active:scale-95"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
