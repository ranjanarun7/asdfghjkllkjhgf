import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from || "/";
  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      login(data.user);

      // ✅ Admin check
      if (data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate(redirectTo);
      }
    }



  };

  // Check for social login token
  React.useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const userId = query.get("userId");
    const isAdmin = query.get("isAdmin");

    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Construct a minimal user object for context
      const user = {
        _id: userId,
        isAdmin: isAdmin === 'true'
      };

      login(user); // Update auth context

      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate(redirectTo);
      }
    }
  }, [location, login, navigate, redirectTo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-inter">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-playfair font-bold text-green-900 mb-2">
            Smart Tourism Jharkhand
          </h1>
          <p className="text-green-700">Experience the beauty of nature</p>
        </div>

        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl shadow-green-900/5 border border-white">
          <h2 className="text-2xl font-playfair font-bold mb-2 text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Please enter your details to sign in
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Password
              </label>
              <input
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-800 font-medium">
                Forgot Password?
              </a>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95">
              Sign In
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google logo" />
              Sign in with Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-green-600 font-bold hover:text-green-700 underline decoration-2 underline-offset-4"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
