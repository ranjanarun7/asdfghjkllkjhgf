import React, { useState } from "react";
import { Star, Heart, ShoppingBag, ArrowLeft, MapPin, Share2, Award, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export const MarketplaceDetail = ({ onBack }) => {
    const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();

    const products = [
        { id: "1", _id: "1", name: "Hand-painted Sohrai Pot", price: 1200, category: "Pottery", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop" },
        { id: "2", _id: "2", name: "Bamboo Cane Basket", price: 450, category: "Crafts", image: "https://images.unsplash.com/photo-1599691653139-e4839818817a?q=80&w=800&auto=format&fit=crop" },
        { id: "3", _id: "3", name: "Tribal Mask (Chhau)", price: 3500, category: "Art", image: "https://images.unsplash.com/photo-1629215037493-272cb2505504?q=80&w=800&auto=format&fit=crop" },
        { id: "4", _id: "4", name: "Organic Honey (500g)", price: 600, category: "Food", image: "https://images.unsplash.com/photo-1587049359681-3676a82e3576?q=80&w=800&auto=format&fit=crop" },
    ];

    // Helper to get quantity of an item in cart
    const getQuantity = (productId) => {
        const item = cart.find((i) => i.productId === productId || i.id === productId || i._id === productId);
        return item ? item.quantity : 0;
    };

    return (
        <div className="min-h-screen bg-neutral pb-20 pt-24">
            <div className="container mx-auto px-6">
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center gap-2 text-gray-800 font-medium hover:text-primary transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>

                {/* Hero Banner - 2/3 width, rounded corners */}
                <div className="w-full  mx-auto relative h-80 rounded-3xl overflow-hidden mb-12 group shadow-xl">
                    <img
                        src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=2000&auto=format&fit=crop"
                        alt="Marketplace Banner"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 md:p-10">
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                            Verified Artisan
                        </span>
                        <h1 className="text-3xl md:text-5xl font-serif text-white font-bold mb-2">
                            Ranchi Tribal Emporium
                        </h1>
                        <div className="flex items-center gap-4 text-white">
                            <span className="flex items-center gap-1">
                                <MapPin size={16} /> Main Road, Ranchi
                            </span>
                            <span className="flex items-center gap-1">
                                <Star size={16} className="text-yellow-400 fill-yellow-400" /> 4.8 (120 Reviews)
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* About Section */}
                        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-serif text-gray-900 font-bold mb-4">About the Seller</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Curated by Ravi Munda, a third-generation artisan, this emporium features authentic handcrafted goods from
                                the deep interiors of Jharkhand. We specialize in Sohrai art paintings, bamboo crafts, and organic forest
                                produce gathered by local tribal communities. Every purchase directly supports 32 tribal families in the
                                Latehar district.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-gray-900 font-medium text-sm">
                                    <Award size={18} className="text-primary" /> Government Certified
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-gray-900 font-medium text-sm">
                                    <LeafIcon className="text-primary w-4 h-4" /> Eco-Friendly Packaging
                                </div>
                            </div>
                        </section>

                        {/* Products */}
                        <section>
                            <h2 className="text-2xl font-serif text-gray-900 font-bold mb-6 flex justify-between items-center">
                                Featured Collections
                                <button className="text-sm text-primary hover:text-accent font-medium">
                                    View All
                                </button>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {products.map((product) => {
                                    const qty = getQuantity(product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group border border-gray-100"
                                        >
                                            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-white text-gray-500 hover:text-red-500 transition-colors backdrop-blur-sm">
                                                    <Heart size={16} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                                                        {product.category}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                                </div>
                                                <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                                            </div>

                                            {qty === 0 ? (
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="w-full mt-2 bg-primary text-white py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <ShoppingBag size={16} /> Add to Cart
                                                </button>
                                            ) : (
                                                <div className="w-full mt-2 flex items-center justify-between bg-gray-100 rounded-lg p-1">
                                                    <button
                                                        onClick={() => decreaseQuantity(product.id)}
                                                        className="p-2 bg-white rounded-md shadow-sm text-primary hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="font-bold text-gray-900">{qty}</span>
                                                    <button
                                                        onClick={() => increaseQuantity(product.id)}
                                                        className="p-2 bg-white rounded-md shadow-sm text-primary hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                                    alt="Ravi Munda"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Ravi Munda</h3>
                                    <p className="text-sm text-gray-500">Master Artisan</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Response Rate</span>
                                    <span className="font-bold text-gray-900">98%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Sales</span>
                                    <span className="font-bold text-gray-900">5000+</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-bold text-gray-900">2018</span>
                                </div>
                            </div>

                            <button className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-colors mb-3">
                                Contact Seller
                            </button>

                            <button className="w-full bg-transparent border border-gray-200 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                <Share2 size={18} /> Share Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <Link to="/cart">
                    <button className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-opacity-90 transition-transform hover:scale-110 z-50 flex items-center gap-2">
                        <ShoppingCart size={24} />
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full absolute -top-1 -right-1">
                            {cart.length}
                        </span>
                    </button>
                </Link>
            )}
        </div>
    );
};

const LeafIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
);