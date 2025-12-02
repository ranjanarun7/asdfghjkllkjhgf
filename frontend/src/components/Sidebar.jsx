import React, { useState } from 'react';
import { Home, Map, HelpCircle, MessageCircle, Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";


const Sidebar = ({ currentView, onViewChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const handleViewChange = (view) => {
    onViewChange(view);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-99 bg-gray-900 p-2 rounded-lg shadow-xl">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside 
        className={`flex flex-col fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white z-50 
          transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:w-64`}
      >
        <div className="p-6 border-b border-gray-800 flex items-center gap-3 cursor-pointer" onClick={() => handleViewChange('overview')}>
          <span className="font-semibold text-lg tracking-tight text-white">Jharkhand Tourism</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <NavItem 
            icon={Home} 
            label="Overview" 
            active={currentView === 'overview'} 
            onClick={() => handleViewChange('overview')}
            className="text-white"
          />
          <NavItem 
            icon={Map} 
            label="Destinations" 
            active={currentView === 'destinations'} 
            onClick={() => handleViewChange('destinations')}
            className="text-white"
          />
          <NavItem 
            icon={HelpCircle} 
            label="AI Assistant Logs" 
            active={currentView === 'ai-logs'} 
            onClick={() => handleViewChange('ai-logs')}
            className="text-white"
          />
          <Link
            to="/feedbackdashboard"
            onClick={() => setIsSidebarOpen(false)} 
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <MessageCircle className="w-5 h-5 text-gray-500 group-hover:text-white" />
            <span className="font-medium text-gray-500">Feedback Dashboard</span>
          </Link>
        </nav>
      </aside>
    </>
  );
};

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${
    active 
      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
  }`}>
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
    <span className="font-medium">{label}</span>
  </button>
);

export default Sidebar;