import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, token, password }),
            });
            const data = await res.json();

            if (data.success) {
                alert("Password reset successful! Please login.");
                navigate("/login");
            } else {
                alert(data.message);
            }
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
                        Reset Password
                    </h2>
                    <p className="text-center text-gray-500 mb-8 text-sm">
                        Enter your new password below
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                New Password
                            </label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
