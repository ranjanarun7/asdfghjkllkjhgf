import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Camera,
  ShieldCheck,
  Award,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("");
  const [document, setDocument] = useState(null);
  const [guideInfo, setGuideInfo] = useState(null);
  const { user, setUser, loading } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/guides/status/${user._id}`)
      .then((res) => res.json())
      .then((data) => setGuideInfo(data))
      .catch(() => setGuideInfo(null));
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login again</div>;

  /* const [user, setUser] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    location: "Ranchi, Jharkhand",
    bio: "Nature lover, avid traveler, and photography enthusiast. Exploring Jharkhand one forest at a time.",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
  }); */

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // agar token store kar rahe ho to:
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            bio: user.bio,
            avatar: user.avatar,
            coverPhoto: user.coverPhoto,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Update failed");
        return;
      }
      setUser(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handleGuideSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("name", user.name);
    formData.append("region", region);
    formData.append("language", language);
    formData.append("document", document);

    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/guides/apply`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.success) {
      setGuideInfo({ status: "pending" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-inter">
      <Navbar />

      <div className="max-w-6xl mx-auto py-12 px-6">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-green-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your personal information and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-green-900/5 border border-white"
            >
              {/* Cover */}
              <div className="h-48 bg-green-900 relative">
                <img
                  src={
                    user?.coverPhoto ||
                    "https://images.unsplash.com/photo-1626246473523-289552cb874a?q=80&w=1600&auto=format&fit=crop"
                  }
                  alt="Cover"
                  className="w-full h-full object-cover opacity-50"
                />

                <div className="absolute -bottom-16 left-8">
                  <div className="relative">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                      alt={user.name}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />

                    {user.isAdmin && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-full mb-2 shadow-md">
                        Admin
                      </div>
                    )}

                    <button className="absolute bottom-2 right-2 bg-green-600 text-black p-2 rounded-full shadow-md hover:bg-green-500 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-20 px-8 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-3xl font-playfair font-bold text-green-900">
                        {user.name}
                      </h2>

                      {guideInfo?.status === "approved" && (
                        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1 border border-green-200">
                          <ShieldCheck size={14} /> Verified Guide
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 flex items-center gap-2 text-sm mt-2">
                      <MapPin size={16} className="text-green-600" /> {user.location || "Location not set"}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${isEditing
                      ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      : "bg-green-50 text-green-800 border border-green-200 hover:bg-green-100"
                      }`}
                  >
                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                  </button>
                </div>

                {/* FORM */}
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* NAME */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                          }
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                        />
                      </div>

                      {/* LOCATION */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Location</label>
                        <input
                          type="text"
                          value={user.location}
                          onChange={(e) =>
                            setUser({ ...user, location: e.target.value })
                          }
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                        />
                      </div>

                      {/* EMAIL */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                          <input
                            type="email"
                            value={user.email}
                            onChange={(e) =>
                              setUser({ ...user, email: e.target.value })
                            }
                            className="w-full p-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* PHONE */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                          <input
                            type="tel"
                            value={user.phone}
                            onChange={(e) =>
                              setUser({ ...user, phone: e.target.value })
                            }
                            className="w-full p-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* AVATAR URL */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Profile Photo URL</label>
                        <input
                          type="text"
                          value={user.avatar || ""}
                          onChange={(e) =>
                            setUser({ ...user, avatar: e.target.value })
                          }
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                          placeholder="Paste avatar image link"
                        />
                      </div>

                      {/* COVER PHOTO URL */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Cover Photo URL</label>
                        <input
                          type="text"
                          value={user.coverPhoto || ""}
                          onChange={(e) =>
                            setUser({ ...user, coverPhoto: e.target.value })
                          }
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                          placeholder="Paste cover image link"
                        />
                      </div>

                      {/* BIO */}
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bio</label>
                        <textarea
                          rows={4}
                          value={user.bio}
                          onChange={(e) =>
                            setUser({ ...user, bio: e.target.value })
                          }
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-95"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</h4>
                      <p className="text-gray-800 font-medium break-all">{user.email}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</h4>
                      <p className="text-gray-800 font-medium">{user.phone || "Not provided"}</p>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">About Me</h4>
                      <div className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
                        {user.bio || "No bio added yet. Click edit to add something about yourself!"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Guide application */}
          {!user.isAdmin && guideInfo?.status !== "approved" && (
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-600 rounded-full blur-3xl -mr-16 -mt-16 opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600 rounded-full blur-3xl -ml-10 -mb-10 opacity-30"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                    <Award className="text-green-300 w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-playfair font-bold mb-3">
                    Become a Guide
                  </h3>
                  <p className="text-green-200 text-sm mb-8 leading-relaxed">
                    Join Jharkhand Tourism’s verified guide network and earn by showcasing the beauty of our state.
                  </p>

                  {/* STATUS — submitted */}
                  {guideInfo?.status === "pending" ? (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
                      <div className="text-3xl mb-3">⏳</div>
                      <h4 className="font-bold text-lg text-white">
                        Application Review
                      </h4>
                      <p className="text-sm text-green-200 mt-2">
                        Our team is verifying your documents. This usually takes 24-48 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleGuideSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-green-300 uppercase tracking-wider mb-2 block">
                          Region Expertise
                        </label>
                        <select
                          className="w-full p-3 rounded-xl bg-white/10 border border-green-600/30 text-white focus:outline-none focus:bg-green-800 focus:border-green-400 transition-colors"
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          required
                        >
                          <option className="text-black" value="">Select Region</option>
                          <option className="text-black">Ranchi & Surroundings</option>
                          <option className="text-black">Netarhat & Latehar</option>
                          <option className="text-black">Deoghar & Santhal Pargana</option>
                          <option className="text-black">Jamshedpur & Dalma</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-green-300 uppercase tracking-wider mb-2 block">
                          Languages
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Hindi, English, Santhali"
                          className="w-full p-3 rounded-xl bg-white/10 border border-green-600/30 text-white placeholder-green-300/50 focus:outline-none focus:bg-green-800 focus:border-green-400 transition-colors"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-green-300 uppercase tracking-wider mb-2 block">
                          Govt ID (Aadhaar/PAN)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            required
                            className="w-full text-sm text-green-200 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            onChange={(e) => setDocument(e.target.files[0])}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-4 bg-white text-green-900 py-3.5 rounded-xl font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        Apply Now <ShieldCheck size={18} />
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
