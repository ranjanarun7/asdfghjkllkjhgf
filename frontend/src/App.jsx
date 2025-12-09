import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Accessibility
import { AccessibilityProvider } from "./context/AccessibilityContext";
import AccessibilityPanel from "./components/AccessibilityPanel";


// Pages
import LandingPage from "./pages/LandingPage";
import ItineraryPlanner from "./pages/ItineraryPlanner";
import PlacesPage from "./pages/PlacesPage";
import MarketplacePage from "./pages/MarketplacePage";
import FeedbackPage from "./pages/FeedbackPage";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePlaces from "./pages/CreatePlaces";
import EditPlace from "./pages/EditPlace";
import PlaceDetailsPage from "./pages/PlaceDetailsPage";
import CartPage from "./pages/CartPage";
import CulturePage from "./pages/CulturePage";
import EmergencyPage from "./pages/EmergencyPage";

import WaterFallPage from "./pages/Category/WaterFallPage";
import HillStation from "./pages/Category/HillStation";
import Valley from "./pages/Category/Valley";
import Park from "./pages/Category/Park";
import Temple from "./pages/Category/Temple";
import FamousCities from "./pages/Category/FamousCities";
import Homestays from "./pages/Category/Homestays";
import Events from "./pages/Category/Events";

import TribalCulture from "./pages/Visit/TribalCulture";
import FolkDance from "./pages/Visit/FolkDance";
import Cuisine from "./pages/Visit/Cuisine";

import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";

import { ProfilePage } from "./pages/ProfilePage";
import { GuideVerification } from "./pages/GuideVerificationPage";


import ItineraryHistoryPage from "./components/ItineraryHistoryPage";
import GuideHistoryPage from "./components/GuideHistoryPage";

import Chat from "./pages/Chat";
import FeedbackDashboard from "./pages/FeedbackDashboard";
import { EventDetail } from "./components/EventDetail";

function App() {
  return (
    <AccessibilityProvider>
      {/* Global Accessibility Panel */}
      <AccessibilityPanel />

      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/itinerary" element={<ItineraryPlanner />} />
          <Route path="/places" element={<PlacesPage />} />

          {/* Categories */}
          <Route path="/waterfall" element={<WaterFallPage />} />
          <Route path="/HillStation" element={<HillStation />} />
          <Route path="/valley" element={<Valley />} />
          <Route path="/park" element={<Park />} />
          <Route path="/temples" element={<Temple />} />
          <Route path="/famousCities" element={<FamousCities />} />
          <Route path="/category/homestays" element={<Homestays />} />
          <Route path="/category/events" element={<Events />} />

          {/* Visit */}
          <Route path="/tribalculture" element={<TribalCulture />} />
          <Route path="/folkdance" element={<FolkDance />} />
          <Route path="/cuisine" element={<Cuisine />} />

          {/* Marketplace */}
          <Route path="/marketplace" element={<MarketplacePage />} />

          {/* Feedback */}
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/feedbackdashboard" element={<FeedbackDashboard />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* CRUD */}
          <Route path="/CreatePlaces" element={<CreatePlaces />} />
          <Route path="/EditPlace/:id" element={<EditPlace />} />
          <Route path="/details/:id" element={<PlaceDetailsPage />} />

          {/* Orders */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Guide Verification */}
          <Route path="/guide-verification" element={<GuideVerification />} />

          {/* History */}
          <Route path="/iteneraryHistory" element={<ItineraryHistoryPage />} />
          <Route path="/guideHistory" element={<GuideHistoryPage />} />

          {/* Chat */}
          <Route path="/chat" element={<Chat />} />

          {/* Event */}
          <Route path="/event/sarhul-festival" element={<EventDetail />} />

          {/* Emergency */}
          <Route path="/emergency" element={<EmergencyPage />} />
        </Routes>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;