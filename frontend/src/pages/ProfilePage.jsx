import React from 'react';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  MapPin,
  Award,
  ChevronRight
} from 'lucide-react';

import { useNavigate } from "react-router-dom";

// ===============================
// PROFILE PAGE
// ===============================
export const ProfilePage = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">

      <div className="container mx-auto max-w-4xl">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-900 font-medium hover:text-primary transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-3">
            My Profile
          </h1>
          <p className="text-gray-500 text-lg">
            Manage your personal information and preferences.
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">

          {/* COVER */}
          <div className="h-56 bg-gradient-to-r from-primary to-green-800 w-full"></div>

          <div className="px-8 md:px-12 pb-12">

            {/* AVATAR */}
            <div className="relative -mt-20 mb-6 flex justify-between items-end">
              <div className="relative">

                <div className="w-40 h-40 rounded-full border-[6px] border-white overflow-hidden bg-gray-100 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <button className="absolute bottom-2 right-2 bg-accent text-white p-2 rounded-full hover:bg-orange-600 transition border-4 border-white shadow-lg">
                  <Camera size={18} />
                </button>

              </div>
            </div>

            {/* NAME + INFO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">

              <div>
                <div className="flex items-center gap-4 mb-2">

                  <h2 className="text-4xl font-serif font-bold text-gray-900">
                    Arun
                  </h2>

                  <span className="bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold shadow-sm border border-primary/20">
                    <CheckCircle2 size={16} />
                    Verified Guide
                  </span>

                </div>

                <div className="flex items-center gap-2 text-gray-500 ml-1">
                  <MapPin size={16} /> Pune
                </div>
              </div>

              <button className="px-8 py-3 rounded-full border border-gray-300 font-bold text-gray-900 hover:bg-gray-50 transition text-sm shadow-sm">
                Edit Profile
              </button>

            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-10">

              <div>
                <label className="block text-gray-900 font-bold mb-1">Email</label>
                <p className="text-gray-600 text-lg">arun@gmail.com</p>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-1">Phone</label>
                <p className="text-gray-600 text-lg">6203472085</p>
              </div>

            </div>

            {/* ABOUT ME */}
            <div>
              <label className="block text-gray-900 font-bold mb-2">About Me</label>
              <p className="text-gray-500 text-lg leading-relaxed">
                I am a Student of Final Year B.Tech. I love exploring new places and guiding tourists to experience the local culture of Jharkhand.
              </p>
            </div>

          </div>
        </div>

        {/* GUIDE VERIFICATION CTA */}
        <div
          onClick={() => navigate("/guide-verification")}
          className="cursor-pointer w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl flex items-center justify-between px-8 py-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group"
        >

          <div className="flex items-center gap-5">

            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-primary transition-colors duration-300">
              <Award size={28} className="text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-bold text-white group-hover:text-primary transition-colors duration-300">
                Guide Verification Status
              </h3>
              <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-200 transition-colors">
                Track your application or apply to become a certified guide.
              </p>
            </div>

          </div>

          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-md">
            <ChevronRight size={20} />
          </div>

        </div>

      </div>
    </div>
  );
};

// ✅ FIXED EXPORT DEFAULT
export default ProfilePage;
