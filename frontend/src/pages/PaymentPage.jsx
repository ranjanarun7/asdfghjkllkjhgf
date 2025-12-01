import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {

  const { state } = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handlePaymentSuccess = async () => {

    // backend ko batana payment successful
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/order/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        orderId: state.orderId,
        paymentId: state.paymentId,
        address: state.address
      })
    });

    navigate("/order-success", {
      state: {
        orderId: state.orderId,
        paymentId: state.paymentId
      }
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-xl text-center">
        <h2 className="text-xl font-bold">Complete Payment</h2>

        <p className="mt-3">Order ID: {state.orderId}</p>
        <p className="mt-1">Payment ID: {state.paymentId}</p>

        <button
          onClick={handlePaymentSuccess}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Simulate Blockchain Payment ✅
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
