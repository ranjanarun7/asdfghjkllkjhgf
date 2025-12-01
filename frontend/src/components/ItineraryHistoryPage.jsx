import React, { useState , useEffect} from "react";
import { Calendar, MapPin, Clock, Download, RefreshCw,ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import * as FeedbackService from "../services/storageService";

const DEMO_ITINERARIES = [
  {
    id: 1,
    title: "Into the Forests of Netarhat",
    date: "12 March 2024",
    duration: "3 Days",
    places: "Ranchi • Khunti • Netarhat",
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Waterfall Trail Adventure",
    date: "9 July 2024",
    duration: "2 Days",
    places: "Jonha • Hundru • Dassam",
    status: "Upcoming",
    image:
      "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Spiritual Trek to Parasnath",
    date: "15 January 2024",
    duration: "1 Day",
    places: "Madhuban • Parasnath Hills",
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=800&auto=format&fit=crop",
  },
];

const ItineraryHistoryPage = () => {
  const [filter, setFilter] = useState("All");
  const [dbItineraries, setDbItineraries] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [rating, setRating] = useState("");
const [comment, setComment] = useState("");

  useEffect(() => {
  const userId = localStorage.getItem("userId");

  fetch(`${process.env.REACT_APP_BACKEND_URL}/itinerary/history/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) setDbItineraries(data.data);
    });
}, []);

const mappedDB = dbItineraries.map(item => ({
  id: item._id,
  title: item.title,
  date: new Date(item.startDate).toDateString(),
  duration: item.days + " Days",
  places: item.cities.join(" • "),
  status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
  image: item.thumbnail || "https://source.unsplash.com/800x600/?jharkhand,nature"
}));

const submitFeedback = async () => {
 const payload = {
  userId: localStorage.getItem("userId"),
  userName: localStorage.getItem("userName") || "Guest",
  targetType: "itinerary",
  targetId: selectedTrip.id,
  targetName: selectedTrip.title,
  rating: Number(rating),
  comment: comment,
  status: "pending"
};


  await FeedbackService.addFeedback(payload);
  alert("Feedback submitted successfully ✅");
  setSelectedTrip(null);
};

const mergedItineraries = [...DEMO_ITINERARIES, ...mappedDB];


  const filteredItems =
  filter === "All"
    ? mergedItineraries
    : mergedItineraries.filter(i => i.status === filter);


  return (
    <div className="min-h-screen bg-earth-100 py-12 px-6">
      <a href="/">
  <button className="btn flex items-center gap-2">
    <ArrowLeft size={18} />
    <span>Back</span>
  </button>
</a>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-green-900 mb-2">
              My Journeys
            </h1>
            <p className="text-gray-600">
              Review your past adventures and upcoming plans.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
              <span className="block text-2xl font-bold text-forest-600">
                {mergedItineraries.length}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Total Trips
              </span>
            </div>
            <div className="bg-green-900 px-6 py-3 rounded-2xl shadow-sm text-white">
              <span className="block text-2xl font-bold">
                {mergedItineraries.filter((i) => i.status === "Upcoming").length}
              </span>
              <span className="text-xs text-green-300 uppercase tracking-wider">
                Upcoming
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {["All", "Upcoming", "Completed", "Cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                filter === f
                  ? "bg-green-600 text-white shadow-lg shadow-forest-900/10"
                  : "bg-white text-gray-600 hover:bg-forest-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Itinerary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-green-900/5 border border-white group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                      item.status === "Completed"
                        ? "bg-green-500 text-white"
                        : item.status === "Upcoming"
                        ? "bg-blue-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-forest-950 mb-4">
                  {item.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar size={16} className="text-forest-400" />
                    <span>{item.date}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock size={16} className="text-forest-400" />
                    <span>{item.duration}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={16} className="text-forest-400" />
                    <span className="truncate">{item.places}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">

  <button className="flex-1 flex items-center justify-center gap-2 bg-forest-50 text-forest-900 py-3 rounded-xl text-sm font-bold hover:bg-forest-100 transition-colors">
    <RefreshCw size={16} /> Recreate
  </button>

  {item.status === "Completed" && (
    <button
      onClick={() => setSelectedTrip(item)}
      className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-green-700"
    >
      Give Feedback
    </button>
  )}

  <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-forest-600 hover:border-forest-600 transition-all">
    <Download size={18} />
  </button>

</div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
      {selectedTrip && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">

      <h2 className="text-xl font-bold mb-3">
        Feedback for {selectedTrip.title}
      </h2>

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      >
        <option value="">Select Rating</option>
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
        <option value="2">⭐⭐</option>
        <option value="1">⭐</option>
      </select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        rows="4"
        placeholder="Write your experience..."
      />

      <div className="flex justify-end gap-3">
        <button 
          onClick={() => setSelectedTrip(null)} 
          className="px-4 py-2 rounded bg-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={submitFeedback}
          className="px-4 py-2 rounded bg-green-600 text-white"
        >
          Submit
        </button>
      </div>

    </div>
  </div>
)}
    </div>
    
  );
};

export default ItineraryHistoryPage;