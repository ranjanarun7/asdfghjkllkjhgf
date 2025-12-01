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
    <div className="min-h-screen bg-earth-100 py-12 px-6">
      <a href="/">
        <button className="btn flex items-center gap-2">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </a>

      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-green-900 mb-2">
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
    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-full mb-2">
      Admin
    </div>
  )}

  <button className="absolute bottom-2 right-2 bg-green-600 text-black p-2 rounded-full shadow-md hover:bg-green-500">
    <Camera size={16} />
  </button>
</div>

                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-20 px-8 pb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-serif font-bold text-green-900">
                        {user.name}
                      </h2>

                      {guideInfo?.status === "approved" && (
                        <span className="text-sm bg-green-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                          ✅ Verified Guide
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                      <MapPin size={14} /> {user.location}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-2 rounded-full text-sm font-bold border border-gray-200 hover:border-green-600 hover:text-green-600"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {/* FORM */}
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* NAME */}
                      <div>
                        <label className="label-xs">Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                          }
                          className="input-field"
                        />
                      </div>

                      {/* LOCATION */}
                      <div>
                        <label className="label-xs">Location</label>
                        <input
                          type="text"
                          value={user.location}
                          onChange={(e) =>
                            setUser({ ...user, location: e.target.value })
                          }
                          className="input-field"
                        />
                      </div>

                      {/* EMAIL */}
                      <div>
                        <label className="label-xs">Email Address</label>
                        <div className="relative">
                          <Mail className="input-icon" size={18} />
                          <input
                            type="email"
                            value={user.email}
                            onChange={(e) =>
                              setUser({ ...user, email: e.target.value })
                            }
                            className="input-field pl-12"
                          />
                        </div>
                      </div>

                      {/* PHONE */}
                      <div>
                        <label className="label-xs">Phone Number</label>
                        <div className="relative">
                          <Phone className="input-icon" size={18} />
                          <input
                            type="tel"
                            value={user.phone}
                            onChange={(e) =>
                              setUser({ ...user, phone: e.target.value })
                            }
                            className="input-field pl-12"
                          />
                        </div>
                      </div>
                      {/* AVATAR URL */}
<div>
  <label className="label-xs">Profile Photo URL</label>
  <input
    type="text"
    value={user.avatar || ""}
    onChange={(e) =>
      setUser({ ...user, avatar: e.target.value })
    }
    className="input-field"
    placeholder="Paste avatar image link"
  />
</div>

{/* COVER PHOTO URL */}
<div>
  <label className="label-xs">Cover Photo URL</label>
  <input
    type="text"
    value={user.coverPhoto || ""}
    onChange={(e) =>
      setUser({ ...user, coverPhoto: e.target.value })
    }
    className="input-field"
    placeholder="Paste cover image link"
  />
</div>

                      {/* BIO */}
                      <div className="md:col-span-2">
                        <label className="label-xs">Bio</label>
                        <textarea
                          rows={3}
                          value={user.bio}
                          onChange={(e) =>
                            setUser({ ...user, bio: e.target.value })
                          }
                          className="input-field resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-green-900 text-black px-8 py-3 rounded-xl font-bold hover:bg-green-800"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                      <h4 className="label-xs">Email</h4>
                      <p className="text-gray-800 font-medium">{user.email}</p>
                    </div>

                    <div>
                      <h4 className="label-xs">Phone</h4>
                      <p className="text-gray-800 font-medium">{user.phone}</p>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="label-xs">About Me</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {user.bio}
                      </p>
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
                className="bg-green-800 rounded-3xl p-8 text-black relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-700 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center mb-6">
                    <Award className="text-green-500 w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-serif font-bold mb-3">
                    Become a Guide
                  </h3>
                  <p className="text-green-600 text-sm mb-8">
                    Join Jharkhand Tourism’s verified guide network.
                  </p>

                  {/* STATUS — submitted */}
                  {guideInfo?.status === "approved" ? (
                    <div className="bg-green-700 rounded-xl p-6 text-center">
                      <h4 className="font-bold text-lg text-white">
                        ✅ Verified Tourism Guide
                      </h4>
                      <p className="text-sm text-green-200 mt-2">
                        You are officially approved by Jharkhand Tourism
                        Department.
                      </p>
                    </div>
                  ) : guideInfo?.status === "pending" ? (
                    <div className="bg-yellow-600 rounded-xl p-6 text-center">
                      <h4 className="font-bold text-lg text-black">
                        ⏳ Application Under Review
                      </h4>
                      <p className="text-sm text-yellow-100 mt-2">
                        Your guide application is being verified.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleGuideSubmit} className="space-y-4">
                      <div>
                        <label className="label-xs text-green-200">
                          Region Expertise
                        </label>
                        <select
                          className="w-full p-3 rounded-xl bg-green-800 border border-green-700 text-white"
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          required
                        >
                          <option>Ranchi & Surroundings</option>
                          <option>Netarhat & Latehar</option>
                          <option>Deoghar & Santhal Pargana</option>
                          <option>Jamshedpur & Dalma</option>
                        </select>
                      </div>

                      <div>
                        <label className="label-xs text-green-200">
                          Languages
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Hindi, English, Santhali"
                          className="w-full p-3 rounded-xl bg-green-700 border border-green-700 text-white placeholder-white"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="label-xs text-green-200">
                          Govt ID (Aadhaar/PAN)
                        </label>
                        <input
                          type="file"
                          required
                          onChange={(e) => setDocument(e.target.files[0])}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={false}
                        className="w-full mt-4 bg-white text-green-800 py-3 rounded-xl font-bold hover:bg-green-100 flex items-center justify-center gap-2"
                      >
                        Apply Now <ShieldCheck size={16} />
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
