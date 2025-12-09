import React, { useState, useEffect } from 'react';
import { Phone, Shield, AlertTriangle, Ambulance, Building2, MapPin, Share2, Loader2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// Mock database of local emergency numbers for Jharkhand cities
const EMERGENCY_ZONES = [
    {
        name: 'Ranchi',
        lat: 23.3441,
        lng: 85.3096,
        contacts: [
            { title: "Ranchi Police Control", number: "0651-2215855", icon: "shield", desc: "Local Police HQ" },
            { title: "RIMS Hospital", number: "0651-2541533", icon: "ambulance", desc: "Emergency Trauma Center" },
            { title: "Ranchi Women Helpline", number: "0651-2490050", icon: "phone", desc: "Local assistance" }
        ]
    },
    {
        name: 'Jamshedpur',
        lat: 22.8046,
        lng: 86.2029,
        contacts: [
            { title: "Jamshedpur Police", number: "0657-2431007", icon: "shield", desc: "Police Control Room" },
            { title: "TMH Emergency", number: "0657-2141016", icon: "ambulance", desc: "Tata Main Hospital" },
            { title: "Women Cell Jamshedpur", number: "1091", icon: "phone", desc: "24/7 Helpline" }
        ]
    },
    {
        name: 'Deoghar',
        lat: 24.4826,
        lng: 86.6970,
        contacts: [
            { title: "Deoghar Thana", number: "06432-222444", icon: "shield", desc: "Local Station" },
            { title: "Sadar Hospital", number: "102", icon: "ambulance", desc: "Emergency Ward" }
        ]
    }
];

// Fallback/State-level contacts
const GLOBAL_CONTACTS = [
    { title: "Police Control Room", number: "100", icon: "shield", desc: "Statewide Helpline" },
    { title: "Ambulance", number: "108", icon: "ambulance", desc: "Free Ambulance Service" },
    { title: "Women Helpline", number: "1091", icon: "phone", desc: "National Helpline" },
    { title: "Tourist Police", number: "0651-2490050", icon: "building", desc: "Dedicated Tourist Cell" }
];

const EmergencyPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error, permission_denied
    const [location, setLocation] = useState(null);
    const [localContacts, setLocalContacts] = useState([]);
    const [nearestCity, setNearestCity] = useState(null);

    const getLocation = () => {
        setStatus('loading');
        if (!navigator.geolocation) {
            setStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                findNearestZone(latitude, longitude);
                setStatus('success');
            },
            (error) => {
                console.error("Location error:", error);
                if (error.code === error.PERMISSION_DENIED) {
                    setStatus('permission_denied');
                } else {
                    setStatus('error');
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    useEffect(() => {
        getLocation();
    }, []);

    const findNearestZone = (lat, lng) => {
        let minDistance = Infinity;
        let closest = null;

        EMERGENCY_ZONES.forEach(zone => {
            // Simple Euclidean distance for approximation (sufficient for city-level selection)
            const dist = Math.sqrt(Math.pow(zone.lat - lat, 2) + Math.pow(zone.lng - lng, 2));
            if (dist < minDistance) {
                minDistance = dist;
                closest = zone;
            }
        });

        // Use approximate threshold (e.g., within ~0.5 degree or approx 50km)
        if (closest && minDistance < 0.5) {
            setNearestCity(closest.name);
            setLocalContacts(closest.contacts);
        } else {
            setNearestCity(null); // Too far from known zones, show general
            setLocalContacts([]);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'shield': return <Shield className="h-8 w-8 text-blue-600" />;
            case 'ambulance': return <Ambulance className="h-8 w-8 text-red-600" />;
            case 'phone': return <Phone className="h-8 w-8 text-pink-600" />;
            case 'building': return <Building2 className="h-8 w-8 text-green-600" />;
            default: return <Shield className="h-8 w-8 text-gray-600" />;
        }
    };

    const shareLocation = () => {
        if (!location) return;
        const mapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
        const message = `🚨 Emergency! I need help. My current location: ${mapUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Combine local contacts (priority) with global fallback
    // Filter globals to avoid duplicates if local covers it? For safety, show both.
    const displayContacts = [...localContacts, ...GLOBAL_CONTACTS].slice(0, 6); // Limit to top 6

    return (
        <div className="min-h-screen bg-red-50 pt-24 px-4 pb-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                {/* Header */}
                <div className="text-center mb-8 animate-fadeIn">
                    <div className="inline-flex items-center justify-center p-6 bg-red-100 rounded-full mb-4 shadow-inner ring-4 ring-red-50">
                        <AlertTriangle className="h-16 w-16 text-red-600 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{t('nav.emergency', 'Emergency Assistance')}</h1>
                    <p className="text-lg text-gray-600">
                        {status === 'loading' && <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin h-4 w-4" /> Locating you...</span>}
                        {status === 'success' && location && nearestCity && <span className="text-green-700 font-semibold flex items-center justify-center gap-2"><MapPin size={18} /> Near {nearestCity}</span>}
                        {status === 'success' && location && !nearestCity && <span className="text-green-700 flex items-center justify-center gap-2"><MapPin size={18} /> Location Detected</span>}
                        {status === 'permission_denied' && (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-red-500 font-medium">Location access is required for SOS.</span>
                                <button onClick={getLocation} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition">
                                    Retry Permission
                                </button>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-red-500">Could not fetch location.</span>
                                <button onClick={getLocation} className="text-sm underline hover:text-red-700">Try Again</button>
                            </div>
                        )}
                    </p>
                </div>

                {/* Live Location Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 mb-10 transform transition-all hover:scale-[1.01]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-full ${status === 'success' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <MapPin className={`h-8 w-8 ${status === 'success' ? 'text-green-600' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Your Live Location</h2>
                                <p className="text-sm text-gray-500">
                                    {location
                                        ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                                        : "Fetching coordinates..."}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={shareLocation}
                            disabled={!location}
                            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all
                                ${location
                                    ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-green-500/30 active:scale-95'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            <Share2 size={24} />
                            Share on WhatsApp
                        </button>
                    </div>
                </div>

                {/* Contacts Grid */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6 px-2 border-l-4 border-red-500 pl-3">
                    {nearestCity ? `Nearest Help in ${nearestCity}` : "Emergency Contacts"}
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {displayContacts.map((contact, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-l-4 border-red-500 flex items-start gap-4 group">
                            <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                {getIcon(contact.icon)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900">{contact.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">{contact.desc}</p>
                                <a href={`tel:${contact.number}`} className="inline-block text-2xl font-bold text-red-600 hover:text-red-700 font-mono tracking-wider">
                                    {contact.number}
                                </a>
                            </div>
                            <a href={`tel:${contact.number}`} className="bg-green-100 text-green-700 p-3 rounded-full hover:bg-green-200 transition-colors shadow-sm">
                                <Phone size={24} />
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                    <AlertTriangle className="inline w-4 h-4 mr-1 mb-1" />
                    <strong>Note:</strong> In extreme emergencies, always dial <strong>100</strong> (Police) or <strong>112</strong> (National Emergency Service).
                </div>
            </div>
        </div>
    );
};

export default EmergencyPage;