import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";


const OrderSuccess = () => {

  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []);


  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl text-green-600 font-bold mb-4">
          ✅ Order Placed Successfully
        </h1>

        <p className="text-lg">Order ID: {state.orderId}</p>
        <p className="text-lg">Payment ID: {state.paymentId}</p>
        {state.txHash && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-sm break-all">
            <p className="font-bold text-gray-700">Blockchain Transaction:</p>
            <p className="text-blue-600">{state.txHash}</p>
          </div>
        )}

        <button
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
