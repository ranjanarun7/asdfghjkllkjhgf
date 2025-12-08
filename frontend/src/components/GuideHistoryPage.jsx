import React from "react";
import {
  Star,
  MapPin,
  Languages,
  Phone,
  ShieldCheck,
  Filter,
  ArrowLeft
} from "lucide-react";
import VerifiedGuides from "./VerifiedGuides";

// Fully rebuilt guide dataset
const guides = [
  {
    id: 1,
    name: "Ravi Kumar",
    location: "Ranchi • Patratu Valley",
    rating: 4.9,
    reviews: 128,
    languages: ["Hindi", "Sadri"],
    lastBooked: "12 Oct 2024",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 2,
    name: "Suman Soren",
    location: "Jamshedpur • Dalma Hills",
    rating: 4.7,
    reviews: 94,
    languages: ["Santhali", "Hindi"],
    lastBooked: "05 Sep 2024",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 3,
    name: "Arvind Singh",
    location: "Deoghar • Parasnath Range",
    rating: 4.5,
    reviews: 73,
    languages: ["Bhojpuri"],
    lastBooked: "18 Aug 2024",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200&auto=format&fit=crop",
    verified: false,
  },
];

const GuideHistoryPage = () => {
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
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-green-900 mb-4">
            My Guides
          </h1>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <p className="text-gray-600">
              Verified local experts you've traveled with.
            </p>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:text-forest-600 transition-colors">
                <Filter size={16} /> Filters
              </button>

              <button className="flex items-center gap-2 bg-green-900 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-900/10 hover:bg-green-800 transition-colors">
                Book New Guide
              </button>
            </div>
          </div>
        </div>

        {/* Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-green-900/5 hover:border-green-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={guide.image}
                      alt={guide.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Verified Badge */}
                  {guide.verified && (
                    <div
                      className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white"
                      title="Govt Verified"
                    >
                      <ShieldCheck size={12} />
                    </div>
                  )}
                </div>

                {/* Ratings */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 mb-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg text-forest-900">
                      {guide.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    ({guide.reviews} reviews)
                  </p>
                </div>
              </div>

              {/* Details */}
              <h3 className="text-xl font-serif font-bold text-green-900 mb-1">
                {guide.name}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-green-400" />
                  {guide.location}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Languages size={16} className="text-green-400" />
                  {guide.languages.join(", ")}
                </div>

                <div className="inline-block bg-green-50 px-3 py-1 rounded-md text-xs font-medium text-forest-700 mt-2">
                  Last trip: {guide.lastBooked}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-green-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-800 transition-colors">
                  Book Again
                </button>

                <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-green-600 transition-colors">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Verified Guides Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif font-bold text-green-900 mb-6 flex items-center gap-3">
            Available Verified Guides
            <span className="text-sm font-sans font-normal bg-green-100 text-green-800 px-3 py-1 rounded-full">Book Now</span>
          </h2>
          <VerifiedGuides />
        </div>
      </div>
    </div>

  );
};

export default GuideHistoryPage;