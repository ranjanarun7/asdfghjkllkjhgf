import React, { useEffect, useRef, useState } from 'react';
import { X, Map as MapIcon, Trash2 } from 'lucide-react';
import { PREMADE_ITINERARIES } from '../constant';

export const MapModal = ({ isOpen, onClose, onSelectLocation }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from local storage
  useEffect(() => {
    const saved = localStorage.getItem('jh_tourist_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current || !window.L) return;

    // If map already exists, invalidate size
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
      return;
    }

    // --- Layers ---
    const osm = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    const googleSat = window.L.tileLayer(
      'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      { attribution: '&copy; Google', maxZoom: 20 }
    );

    const trafficLayer = window.L.tileLayer(
      'https://mt1.google.com/vt/lyrs=h,traffic&x={x}&y={y}&z={z}',
      { attribution: '&copy; Google Traffic', maxZoom: 20, opacity: 0.7 }
    );

    // --- Map Init ---
    const map = window.L.map(mapContainerRef.current, {
      center: [23.6102, 85.2799],
      zoom: 8,
      layers: [osm]
    });

    mapRef.current = map;

    // --- Layer Control ---
    const baseMaps = {
      "Street View": osm,
      "Satellite": googleSat
    };
    const overlayMaps = {
      "Traffic Info": trafficLayer
    };
    window.L.control.layers(baseMaps, overlayMaps).addTo(map);

    // --- Drawn Items ---
    const drawnItems = new window.L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    if (window.L.Control && window.L.Control.Draw) {
      const drawControl = new window.L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: {
          polygon: false,
          circle: false,
          rectangle: false,
          circlemarker: false,
          marker: true,
          polyline: {
            shapeOptions: { color: '#10b981', weight: 4 }
          }
        }
      });
      map.addControl(drawControl);

      map.on(window.L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        const type = e.layerType;

        drawnItems.addLayer(layer);

        if (type === 'marker') {
          const title = prompt("Enter a name for this location to save it as a favorite:");
          if (title) {
            const latLng = layer.getLatLng();
            saveFavorite(title, latLng.lat, latLng.lng);
            layer
              .bindPopup(`<b>${title}</b><br><span class="text-xs text-gray-500">Custom Favorite</span>`)
              .openPopup();
          }
        } else if (type === 'polyline') {
          layer.bindPopup("Custom Route").openPopup();
        }
      });
    }

    // --- Tourist Spots ---
    const customIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color:#10b981;
          width:24px;
          height:24px;
          border-radius:50%;
          border:2px solid white;
          box-shadow:0 2px 4px rgba(0,0,0,.3);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });

    PREMADE_ITINERARIES.forEach((itinerary) => {
      const marker = window.L.marker(
        [itinerary.coordinates.lat, itinerary.coordinates.lng],
        { icon: customIcon }
      ).addTo(map);

      const popupContent = `
        <div class="p-1">
          <h3 class="font-bold text-stone-800 text-sm">${itinerary.location}</h3>
          <p class="text-xs text-stone-500 my-1">${itinerary.title}</p>
          <button 
            id="btn-${itinerary.id}"
            class="bg-emerald-600 text-black text-xs px-3 py-1 rounded mt-1 hover:bg-emerald-700 w-full"
          >View Plan</button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-${itinerary.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            onSelectLocation(itinerary.title);
            onClose();
          };
        }
      });
    });

    // Fix rendering
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen, onClose, onSelectLocation]);

  // Render favorites
  useEffect(() => {
    if (!mapRef.current || !drawnItemsRef.current || !window.L) return;

    favorites.forEach(fav => {
      const favIcon = window.L.divIcon({
        className: 'fav-div-icon',
        html: `
          <div style="
            background-color:#f59e0b;
            width:20px;
            height:20px;
            border-radius:50%;
            border:2px solid white;
            box-shadow:0 2px 4px rgba(0,0,0,.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      });

      let exists = false;

      drawnItemsRef.current.eachLayer(layer => {
        if (layer.getLatLng) {
          const latLng = layer.getLatLng();
          if (latLng.lat === fav.lat && latLng.lng === fav.lng) exists = true;
        }
      });

      if (!exists) {
        const marker = window.L.marker([fav.lat, fav.lng], { icon: favIcon });
        marker.bindPopup(`
          <b>${fav.title}</b><br/>
          <span class="text-xs text-amber-600">★ Saved Favorite</span>
        `);
        drawnItemsRef.current.addLayer(marker);
      }
    });

  }, [favorites]);

  const saveFavorite = (title, lat, lng) => {
    const newFav = {
      id: Date.now().toString(),
      title,
      lat,
      lng
    };
    const updated = [...favorites, newFav];
    setFavorites(updated);
    localStorage.setItem('jh_tourist_favorites', JSON.stringify(updated));
  };

  const clearFavorites = () => {
    if (window.confirm("Are you sure you want to clear all saved favorites?")) {
      setFavorites([]);
      localStorage.removeItem('jh_tourist_favorites');
      if (drawnItemsRef.current) drawnItemsRef.current.clearLayers();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-emerald-700 text-black">
          <div className="flex items-center gap-3">
            <MapIcon size={20} />
            <div>
              <h2 className="text-lg font-bold">Interactive Map</h2>
              <p className="text-[10px] opacity-80">Draw routes, view traffic, save spots</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {favorites.length > 0 && (
              <button
                onClick={clearFavorites}
                className="flex items-center gap-1 text-xs bg-red-500/20 hover:bg-red-500/40 px-2 py-1 rounded text-red-100 border border-red-500/30"
              >
                <Trash2 size={12} /> Clear Favs
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-emerald-600 rounded-full">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 bg-stone-100 relative">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Guide */}
          <div className="absolute bottom-6 left-4 bg-white/95 p-4 rounded-xl shadow-lg text-xs z-[1000] border max-w-[240px]">
            <h4 className="font-bold mb-2">Map Guide</h4>
            <p>🟢 Tourist Spots</p>
            <p>🟡 Your Favorites</p>
            <hr className="my-2" />
            <p>• Use draw tools to add markers or routes.</p>
            <p>• Use layers to switch satellite/traffic.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
