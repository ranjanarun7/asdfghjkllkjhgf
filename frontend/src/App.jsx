import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from './pages/LandingPage';
import ItineraryPlanner from './pages/ItineraryPlanner';
import PlacesPage from './pages/PlacesPage';
import MarketplacePage from './pages/MarketplacePage';
import FeedbackPage from './pages/FeedbackPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePlaces from './pages/CreatePlaces';
import EditPlace from './pages/EditPlace';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import CartPage from './pages/CartPage';
import CulturePage from './pages/CulturePage';
import WaterFallPage from './pages/Category/WaterFallPage';
import HillStation from './pages/Category/HillStation';
import Valley from './pages/Category/Valley';
import Park from './pages/Category/Park';
import Temple from './pages/Category/Temple';
import FamousCities from './pages/Category/FamousCities';
import TribalCulture from './pages/Visit/TribalCulture';
import FolkDance from './pages/Visit/FolkDance';
import Cuisine from './pages/Visit/Cuisine';
import CheckoutPage from './pages/CheckoutPage'
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import Homestays from './pages/Category/Homestays';
import Events from './pages/Category/Events';
import Profile from "./pages/ProfilePage";
import ItineraryHistoryPage from './components/ItineraryHistoryPage';
import GuideHistoryPage from './components/GuideHistoryPage';
import Chat from "./pages/Chat";
import FeedbackDashboard from './pages/FeedbackDashboard';
import { GuideVerification } from './pages/GuideVerificationPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/itinerary" element={<ItineraryPlanner />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/waterfall" element={<WaterFallPage />} />
        <Route path="/HillStation" element={<HillStation />} />
        <Route path='/valley' element={<Valley />} />
        <Route path='/park' element={<Park />} />
        <Route path='/temples' element={<Temple />} />
        <Route path='/famousCities' element={<FamousCities />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/CreatePlaces" element={<CreatePlaces />} />
        <Route path="/EditPlace/:id" element={<EditPlace />} />
        <Route path="/details/:id" element={<PlaceDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/culture" element={<CulturePage />} />
        <Route path="/tribalculture" element={<TribalCulture />} />
        <Route path="/folkdance" element={<FolkDance />} />
        <Route path="/cuisine" element={<Cuisine />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/category/:category" element={<Homestays />} />
        <Route path="/category/:category" element={<Events />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/iteneraryHistory" element={<ItineraryHistoryPage />} />
        <Route path="/guideHistory" element={<GuideHistoryPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/feedbackdashboard" element={<FeedbackDashboard />} />
        <Route path="/guide-verification" element={<GuideVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
