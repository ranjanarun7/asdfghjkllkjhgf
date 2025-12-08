import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccommodationCards() {
  const [view, setView] = useState("landing"); // 'landing', 'events', 'detail'
  const navigate = useNavigate();

  const cards = [
    {
      title: "Home Stays",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShKH2PzkPH-FyYozhLShWzWEhB4mAC_Vjfmw&s",
      link: "/category/homestay",
    },
    {
      title: "Heritage Hotels",
      img: "https://png.pngtree.com/thumb_back/fh260/background/20220311/pngtree-bedroom-guest-room-five-star-hotel-image_990205.jpg",
      link: "#",
    },
    {
      title: "Events",
      img: "https://img.freepik.com/free-vector/flat-background-holi-festival-celebration_23-2151197790.jpg?semt=ais_hybrid&w=740&q=80",
      type: "event_trigger",
    },
  ];

  const handleCardClick = (e, card) => {
    if (card.type === "event_trigger") {
      e.preventDefault();
      setView("events");
    }
  };



  // View: Events List (Intermediate Step)
  if (view === "events") {
    return (
      <div className="min-h-screen w-full bg-green-50 p-10 pt-24">
        <div className="container mx-auto">
          <button
            onClick={() => setView("landing")}
            className="mb-8 flex items-center gap-2 text-green-800 font-medium hover:text-green-600 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Categories
          </button>

          <h1 className="text-4xl font-bold text-center text-green-900 mb-12">
            Upcoming Events
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sarhul Festival Card */}
            <div
              onClick={() => navigate("/event/sarhul-festival")}
              className="bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop"
                  alt="Sarhul Festival"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-green-800">
                  Apr 14
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                    Cultural Festival
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                  Sarhul Festival 2025
                </h3>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  Worship of the Sal Tree. Immerse yourself in the rhythm of the mandars and the fragrance of Sal flowers.
                </p>
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <span>📍 Ranchi</span>
                  <span>🕒 10:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // View: Landing Page (Default)
  return (
    <div className="min-h-screen w-full bg-green-50 p-10" >
      <h1 className="text-4xl md:text-5xl font-bold text-center text-green-900 mb-8 drop-shadow-lg mt-4">
        Your Next Getaway - Book Stays & Events
      </h1>
      <div className="w-56 h-1 bg-green-900 mx-auto mb-12"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:h-96">
        {cards.map((c, i) => (
          <a
            key={i}
            href={c.link || "#"}
            onClick={(e) => handleCardClick(e, c)}
            className="relative group rounded-2xl overflow-hidden shadow-xl cursor-pointer"
          >
            <img
              src={c.img}
              alt={c.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-50"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 bg-transparent bg-black bg-opacity-70">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg text-center">
                {c.title}
              </h2>
              <button className="px-6 py-4 absolute bottom-2  text-yellow-200 rounded-full font-semibold shadow-lg group-hover:scale-105 transition">
                {c.title === "Events" ? "EXPLORE EVENTS" : "BOOK NOW"}
              </button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}