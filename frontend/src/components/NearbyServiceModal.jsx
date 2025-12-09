import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Phone, X, Play, Square, Map as MapIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Icons = {
    user: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    }),
    service: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    }),
    destination: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    })
};

// Map Recenter Component
const MapRecenter = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, 15);
    }, [center, map]);
    return null;
};

// OSRM Route Fetcher
const fetchRoute = async (start, end) => {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
            return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // Flip to [lat, lng]
        }
        return null;
    } catch (err) {
        console.error("Routing Error:", err);
        return null;
    }
};

const OSM_TAGS = {
    "Local Guide": null, // Mock fallback
    "Transport": "amenity=bus_station",
    "Restaurants": "amenity=restaurant",
    "Police Station": "amenity=police",
    "Hospital": "amenity=hospital",
    "Petrol Pump": "amenity=fuel",
    "ATM": "amenity=atm",
    "Hotels": "tourism=hotel"
};

const NearbyServiceModal = ({ isOpen, onClose, userLocation, serviceType }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [route, setRoute] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        if (!isOpen || !userLocation || !serviceType) return;

        setLoading(true);
        setRoute(null);
        setSelectedPlace(null);
        setIsNavigating(false);

        const fetchPlaces = async () => {
            // Mock Data Fallback for Guides
            if (serviceType.label === "Local Guide") {
                const mockGuides = [
                    { id: 1, name: "Rahul Kumar", detail: "Hindi, English", rating: 4.8, contacts: "9988776655", lat: userLocation.latitude + 0.005, lng: userLocation.longitude + 0.005 },
                    { id: 2, name: "Priya Singh", detail: "English, Bengali", rating: 4.9, contacts: "9988776656", lat: userLocation.latitude - 0.004, lng: userLocation.longitude + 0.008 },
                    { id: 3, name: "Amit Mundu", detail: "Local Expert", rating: 4.5, contacts: "9988776657", lat: userLocation.latitude + 0.008, lng: userLocation.longitude - 0.003 }
                ];
                setResults(mockGuides);
                setLoading(false);
                return;
            }

            // Overpass API Query
            const tag = OSM_TAGS[serviceType.label];
            if (!tag) {
                setResults([]);
                setLoading(false);
                return;
            }

            const query = `
                [out:json];
                node(around:5000,${userLocation.latitude},${userLocation.longitude})[${tag}];
                out 10;
             `;

            try {
                const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
                const data = await res.json();

                const mapped = data.elements.map(el => ({
                    id: el.id,
                    name: el.tags.name || `${serviceType.label}(Unnamed)`,
                    detail: el.tags['addr:street'] || serviceType.label,
                    lat: el.lat,
                    lng: el.lon,
                    distance: "..." // Calculate if needed
                }));
                setResults(mapped);
            } catch (err) {
                console.error("Overpass API Error:", err);
                // Fallback to empty
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();

    }, [isOpen, userLocation, serviceType]);

    const handleDirections = async (place) => {
        setSelectedPlace(place);
        const path = await fetchRoute(
            { lat: userLocation.latitude, lng: userLocation.longitude },
            { lat: place.lat, lng: place.lng }
        );
        setRoute(path);
        setIsNavigating(true);
    };

    const stopNavigation = () => {
        setIsNavigating(false);
        setRoute(null);
        setSelectedPlace(null);
    };

    if (!isOpen) return null;
    const ServiceIcon = serviceType?.Icon || MapPin;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh]"
            >
                {/* Map Section */}
                <div className="w-full md:w-2/3 h-1/2 md:h-full relative bg-gray-100">
                    {userLocation ? (
                        <MapContainer
                            center={[userLocation.latitude, userLocation.longitude]}
                            zoom={14}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={Icons.user}>
                                <Popup>You are Here</Popup>
                            </Marker>

                            {results.map(place => (
                                <Marker
                                    key={place.id}
                                    position={[place.lat, place.lng]}
                                    icon={selectedPlace?.id === place.id ? Icons.destination : Icons.service}
                                >
                                    <Popup>
                                        <div className="text-center">
                                            <strong>{place.name}</strong><br />
                                            <button
                                                onClick={() => handleDirections(place)}
                                                className="mt-2 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                                            >
                                                Start Nav
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {route && <Polyline positions={route} color="#2563eb" weight={5} dashArray={isNavigating ? "10, 10" : null} />}
                            {selectedPlace && <MapRecenter center={[selectedPlace.lat, selectedPlace.lng]} />}
                        </MapContainer>
                    ) : <div className="h-full flex items-center justify-center">Locating...</div>}

                    {/* Navigation Overlay */}
                    {isNavigating && selectedPlace && (
                        <div className="absolute top-4 left-4 right-16 md:right-auto md:w-96 bg-white p-4 rounded-xl shadow-xl z-[1000] border border-blue-100 animate-slideIn">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-800">{selectedPlace.name}</h3>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">LIVE NAV</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                                <Navigation size={14} className="text-blue-500" />
                                Calculating fastest route...
                            </p>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border border-red-100" onClick={stopNavigation}>
                                    <Square size={16} fill="currentColor" /> Stop
                                </button>
                                <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md transition-all active:scale-95">
                                    <Play size={16} fill="currentColor" /> Start
                                </button>
                            </div>
                        </div>
                    )}

                    <button onClick={onClose} className="md:hidden absolute top-4 right-4 z-[1000] bg-white p-2 rounded-full shadow-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* List Section */}
                <div className="w-full md:w-1/3 h-1/2 md:h-full bg-white flex flex-col border-l border-gray-100">
                    <div className="p-5 border-b flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ServiceIcon className="text-blue-600" size={24} />
                                Nearby {serviceType?.label}
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Real-time GPS results</p>
                        </div>
                        <button onClick={onClose} className="hidden md:block p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                        {loading && (
                            <div className="flex flex-col items-center justify-center h-48 space-y-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-gray-500">Scanning satellite data...</span>
                            </div>
                        )}

                        {!loading && results.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleDirections(item)}
                                className={`
                                    border p-4 rounded-xl cursor-pointer transition-all duration-200 bg-white
                                    ${selectedPlace?.id === item.id ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-gray-100 hover:border-blue-300 hover:shadow-sm'}
                                `}
                            >
                                <div className="flex gap-4">
                                    <div className="bg-blue-50 p-2 rounded-lg h-12 w-12 flex items-center justify-center text-blue-600 shrink-0">
                                        <ServiceIcon size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-800 truncate">{item.name}</h3>
                                            {item.rating && (
                                                <span className="flex items-center text-xs font-bold bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-100">
                                                    ★ {item.rating}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3 truncate">{item.detail}</p>

                                        <div className="flex gap-2">
                                            <button
                                                className="flex-1 bg-black text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                                            >
                                                <Navigation size={12} /> Start Navigation
                                            </button>
                                            {item.contacts && (
                                                <a
                                                    href={`tel:${item.contacts}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors"
                                                >
                                                    <Phone size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div >
        </div >
    );
};

export default NearbyServiceModal;