import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Signup = () => {
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  location: "",
  bio: "",
  avatar: "",
  coverPhoto: ""
});



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
  alert("Name, email and password are required");
  return;
}

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });


    const data = await res.json();
    alert(data.message);
    if (data.success) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Navbar />
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="font-bold text-green-600 mb-6">Smart Tourism Jharkhand</h1>
      <form className="w-96 bg-white p-6 shadow rounded" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">Create a New Account</h2>
        <p className="text-center text-gray-400 mb-4">Join us by filling out the information below.</p>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
  className="border p-2 w-full mb-3"
  placeholder="Phone Number"
  onChange={(e) => setForm({ ...form, phone: e.target.value })}
/>
<input
  className="border p-2 w-full mb-3"
  placeholder="Location"
  onChange={(e) => setForm({ ...form, location: e.target.value })}
/>
<textarea
  className="border p-2 w-full mb-3"
  placeholder="Short Bio"
  rows={2}
  onChange={(e) => setForm({ ...form, bio: e.target.value })}
/>
<input
  className="border p-2 w-full mb-3"
  placeholder="Avatar Image URL (optional)"
  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
/>

<input
  className="border p-2 w-full mb-3"
  placeholder="Cover Photo URL (optional)"
  onChange={(e) => setForm({ ...form, coverPhoto: e.target.value })}
/>



        <button className="btn-primary w-full">Signup</button>
        <p>Already have an account? <a href="/login" className="text-blue-600">Login</a></p>
      </form>
    </div>
    </div>
  );
};

export default Signup;
