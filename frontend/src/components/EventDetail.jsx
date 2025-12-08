import React from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Music, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EventDetail = ({ onBack, onBook }) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-neutral text-gray-800 pb-20 pt-24">
            {/* Background Graphic - lighter, subtler for light mode */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <button
                    onClick={() => (onBack ? onBack() : navigate(-1))}
                    className="mb-8 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
                >
                    <ArrowLeft size={20} /> Back to Events
                </button>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Main Info */}
                    <div className="lg:w-2/3">
                        <div className="relative rounded-3xl overflow-hidden mb-8 aspect-video shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1623689435439-d3dd81f08bc5?q=80&w=2000&auto=format&fit=crop"
                                alt="Sarhul Festival Celebration"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm">
                                <span className="block text-2xl font-bold text-center text-gray-900">14</span>
                                <span className="block text-xs uppercase tracking-wider text-gray-600">APRIL</span>
                            </div>
                        </div>

                        <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-4 border border-accent/20">
                            Cultural Festival
                        </span>

                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-gray-900">
                            Sarhul Festival 2025: <br />{" "}
                            <span className="text-primary">Worship of the Sal Tree</span>
                        </h1>

                        <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-3xl">
                            Immerse yourself in the rhythm of the mandars and the fragrance of Sal
                            flowers. Sarhul is the most significant festival of the tribal communities
                            in Jharkhand, marking the beginning of the New Year. Experience traditional
                            dance, music, and the sacred rituals that honor nature.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-gray-900">Date & Time</h3>
                                    <p className="text-gray-500">April 14 - April 15, 2025</p>
                                    <p className="text-gray-500">Starts at 10:00 AM</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-start gap-4">
                                <div className="bg-accent/10 p-3 rounded-lg text-accent">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-gray-900">Location</h3>
                                    <p className="text-gray-500">Tribal Cultural Complex,</p>
                                    <p className="text-gray-500">Morabadi Ground, Ranchi</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900">Event Highlights</h2>

                        <div className="space-y-4">
                            {[
                                {
                                    time: "10:00 AM",
                                    title: "Grand Procession",
                                    desc: "Traditional Shobha Yatra featuring 30+ tribal groups.",
                                },
                                {
                                    time: "01:00 PM",
                                    title: "Ritual Worship",
                                    desc: "Pahan (Priest) performing the Sal tree worship.",
                                },
                                {
                                    time: "04:00 PM",
                                    title: "Cultural Performance",
                                    desc: "Chhau and Santhali dance showcase.",
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="w-24 pt-1 text-right text-gray-500 font-mono text-sm group-hover:text-primary transition-colors">
                                        {item.time}
                                    </div>
                                    <div className="flex-1 pb-8 border-l border-gray-200 pl-6 relative">

                                        <h3 className="font-bold text-xl mb-1 text-gray-800 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sticky Booking Card */}
                    <div className="lg:w-1/3 relative lg:sticky lg:top-24">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <span className="text-gray-500 text-sm block">Starting from</span>
                                    <span className="text-3xl font-bold text-primary">₹499</span>
                                </div>

                                <div className="bg-red-50 text-red-500 text-xs px-2 py-1 rounded font-bold uppercase border border-red-100">
                                    Selling Fast
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8 text-gray-600 text-sm">
                                <li className="flex items-center gap-2">
                                    <Music size={16} className="text-primary" /> Access to all cultural zones
                                </li>
                                <li className="flex items-center gap-2">
                                    <Users size={16} className="text-primary" /> Guided ritual tour included
                                </li>
                                <li className="flex items-center gap-2">
                                    <Clock size={16} className="text-primary" /> Valid for full day
                                </li>
                            </ul>

                            <button
                                onClick={onBook}
                                className="w-full bg-primary hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all mb-4 flex justify-center items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <Ticket size={20} /> Get Tickets
                            </button>

                            <button className="w-full bg-transparent border-2 border-primary text-primary hover:bg-primary/5 font-medium py-3 rounded-xl transition-all">
                                View Seating Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};