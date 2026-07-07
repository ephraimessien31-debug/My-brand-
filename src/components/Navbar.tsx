import React from 'react';
import { Camera, Layers, Globe, Calendar, FileText, BarChart3, HelpCircle, User } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({ activeSection, setActiveSection, user, onLogin, onLogout }: NavbarProps) {
  const navItems = [
    { id: 'hero', label: 'Home', icon: Globe },
    { id: 'branding', label: 'AI Branding & Templates', icon: Layers },
    { id: 'gbp', label: 'GBP SEO Manager', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio', icon: Camera },
    { id: 'booking', label: 'Book Package', icon: Calendar },
    { id: 'google-form', label: 'Design Questionnaire', icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#06080e]/85 backdrop-blur-md border-b border-white/5 text-white shadow-xl relative overflow-hidden">
      {/* Glossy line effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveSection('hero')}>
            <Logo size="sm" showSlogan={true} />
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 relative ${
                    isActive
                      ? 'bg-gradient-to-b from-cyan-500/5 to-blue-500/5 text-cyan-400 border border-cyan-500/25 shadow-inner shadow-cyan-500/5'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Sign In */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="h-6 w-6 rounded-full referrerPolicy='no-referrer'" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-xs font-bold text-slate-200 max-w-[100px] truncate hidden md:inline">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={onLogout}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-bold border-l border-white/10 pl-2.5"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="glossy-btn flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs px-4 py-2 rounded-full font-extrabold shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/30 transition-all duration-200"
              >
                <User className="h-3.5 w-3.5" />
                <span>Google Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar Helper (Just small horizontal scrolling bar) */}
      <div className="lg:hidden flex items-center overflow-x-auto space-x-2 px-4 py-2 border-t border-white/5 bg-[#05070c]/60 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={`mob-${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 bg-white/5 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
