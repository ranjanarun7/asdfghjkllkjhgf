import React from 'react';
import { Home, Map, HelpCircle,MessageCircle} from 'lucide-react';
import { Link } from "react-router-dom";


const Sidebar = ({ currentView, onViewChange }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-slate-900 text-black fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('overview')}>
        
        <span className="font-semibold text-lg tracking-tight">Jharkhand Tourism</span>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        <NavItem 
          icon={Home} 
          label="Overview" 
          active={currentView === 'overview'} 
          onClick={() => onViewChange('overview')}
        />
        <NavItem 
          icon={Map} 
          label="Destinations" 
          active={currentView === 'destinations'} 
          onClick={() => onViewChange('destinations')}
        />
        <NavItem 
          icon={HelpCircle} 
          label="AI Assistant Logs" 
          active={currentView === 'ai-logs'} 
          onClick={() => onViewChange('ai-logs')}
        />
        <Link
  to="/feedbackdashboard"
  className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
>
  <MessageCircle className="w-5 h-5" />
  Feedback Dashboard
</Link>

      </nav>
    </aside>
  );
};

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all duration-200 ${
    active 
      ? 'bg-emerald-600 text-green shadow-lg shadow-emerald-900/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-green'
  }`}>
    <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-slate-500 group-hover:text-black'}`} />
    <span className="font-medium">{label}</span>
  </button>
);

export default Sidebar;