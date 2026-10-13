import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  MapPin, 
  Bookmark, 
  ShieldCheck, 
  Bot, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  Search
} from 'lucide-react';

export const Navbar = ({ onOpenChat }) => {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-campus-500 to-campus-700 flex items-center justify-center text-white shadow-md shadow-campus-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-campus-600 to-campus-900 bg-clip-text text-transparent">
                CampusNav
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">
                Smart Navigation
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive('/')
                  ? 'bg-campus-50 text-campus-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Campus Map</span>
            </Link>

            <Link
              to="/explore"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive('/explore')
                  ? 'bg-campus-50 text-campus-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Explore Facilities</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/saved-routes"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive('/saved-routes')
                    ? 'bg-campus-50 text-campus-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved Routes</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive('/admin')
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center space-x-3">
            {/* CampusBot AI Chatbot Button */}
            <button
              onClick={onOpenChat}
              className="relative inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-campus-500 to-indigo-600 text-white shadow-sm hover:shadow-md hover:from-campus-600 hover:to-indigo-700 transition-all cursor-pointer"
              title="Open CampusBot AI Assistant"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Ask CampusBot</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
              </span>
            </button>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {user?.fullName || user?.username}
                  </span>
                  <span className="text-[10px] font-medium text-campus-600 uppercase">
                    {user?.roles?.[0]?.replace('ROLE_', '') || 'User'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-campus-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
