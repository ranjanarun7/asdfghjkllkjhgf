import React from "react";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PaymentButton = ({ amount = 500, placeName = "Tour Booking" }) => {
  const handlePayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Failed to load Razorpay SDK!");
      return;
    }

    // Create order from backend
    const orderRes = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/payment/create-order`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }), // amount in rupees
      }
    );

    const data = await orderRes.json();
    if (!data.success) {
      alert("Error creating Razorpay order");
      return;
    }

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Jharkhand Tourism",
      description: `Booking for ${placeName}`,
      order_id: data.order.id,

      handler: async function (response) {
        // Verify payment on backend
        const verifyRes = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/payment/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }
        );

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          alert("Payment Successful!");
          window.location.href = "/payment-success";
        } else {
          alert("Payment failed to verify!");
        }
      },

      prefill: {
        name: "Your Customer",
        email: "customer@example.com",
        contact: "9999999999",
      },

      theme: {
        color: "#0F766E",
      },
    };

    const paymentObj = new window.Razorpay(options);
    paymentObj.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PaymentButton;
