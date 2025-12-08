import React, { useEffect, useState } from 'react';
import { User, ShieldCheck, MapPin, Languages } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifiedGuides = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/guides/verified`)
            .then(res => res.json())
            .then(data => {
                setGuides(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch verified guides:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-gray-500 animate-pulse">Loading guides...</div>;
    if (guides.length === 0) return <div className="text-gray-500 italic">No verified guides available for booking at this moment.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
                <motion.div
                    key={guide._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-5 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow flex flex-col"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100">
                                <img
                                    src={guide.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                                    alt={guide.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-1">
                                    {guide.name}
                                    <ShieldCheck size={16} className="text-green-500 fill-green-100" />
                                </h3>
                                <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block">
                                    Verified Guide
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6 flex-grow">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{guide.region}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Languages size={16} className="text-gray-400" />
                            <span>{guide.language}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => alert(`Booking request sent for ${guide.name}!`)}
                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transform active:scale-95 transition-all shadow-md shadow-green-200"
                    >
                        Book Now
                    </button>
                </motion.div>
            ))}
        </div>
    );
};

export default VerifiedGuides;
