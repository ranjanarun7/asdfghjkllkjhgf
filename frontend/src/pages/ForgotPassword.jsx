import React, { useState } from "react";
import Navbar from "../components/Navbar";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-inter">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
                <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl shadow-green-900/5 border border-white">
                    <h2 className="text-2xl font-playfair font-bold mb-2 text-center text-gray-800">
                        Forgot Password
                    </h2>
                    <p className="text-center text-gray-500 mb-8 text-sm">
                        Enter your email to receive a reset link
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                Email Address
                            </label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
