import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoDashboard from './components/BentoDashboard';
import BrandingStudio from './components/BrandingStudio';
import GbpManager from './components/GbpManager';
import DronePortfolio from './components/DronePortfolio';
import PackageBooking from './components/PackageBooking';
import DesignForm from './components/DesignForm';
import Chatbot from './components/Chatbot';
import { auth, googleAuthProvider } from './lib/firebase.ts';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Sync user profile to Cloud SQL PostgreSQL database upon authentication
        try {
          const token = await firebaseUser.getIdToken();
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const dbUser = await res.json();
            console.log('Synced user with database:', dbUser);
          }
        } catch (error) {
          console.error('Failed to sync user profile with database:', error);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-200 flex flex-col font-sans select-none antialiased relative overflow-x-hidden">
      {/* Glossy Dynamic Mesh Backgrounds */}
      <div className="absolute inset-0 mesh-glow-1 pointer-events-none z-0" />
      <div className="absolute inset-0 mesh-glow-2 pointer-events-none z-0" />
      
      {/* Navbar Navigation */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative z-10">
        {activeSection === 'hero' && (
          <>
            {/* Ambient Hero Panel */}
            <Hero onNavigate={setActiveSection} />
            
            {/* Bento Dashboard Section */}
            <div className="border-t border-slate-900/60 pt-10">
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>Systems Core Active</span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Interactive Workspace Core</h2>
                  <p className="text-xs text-slate-400 mt-1">Select any Bento block below to dive into live configurations & mockups.</p>
                </div>
              </div>
              <BentoDashboard onNavigate={setActiveSection} />
            </div>
          </>
        )}

        {/* Modular Tabs Pages */}
        {activeSection === 'branding' && (
          <div className="space-y-4">
            <div className="border-b border-slate-900/60 pb-6 mb-8">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                <span>Model Workspace</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">AI-Powered Template Studio</h1>
              <p className="text-sm text-slate-400 mt-1.5">Configure custom brand copy, taglines, and aesthetic colors instantly using Gemini model intelligence.</p>
            </div>
            <BrandingStudio />
          </div>
        )}

        {activeSection === 'gbp' && (
          <div className="space-y-4">
            <div className="border-b border-slate-900/60 pb-6 mb-8">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                <span>Local Search Console</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Google Business Profile Optimization Manager</h1>
              <p className="text-sm text-slate-400 mt-1.5">Automate review reply drafting with keyword insertions and inspect real-time map index metrics.</p>
            </div>
            <GbpManager />
          </div>
        )}

        {activeSection === 'portfolio' && (
          <div className="space-y-4">
            <div className="border-b border-slate-900/60 pb-6 mb-8">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                <span>Creative Assets</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Interactive Portfolios & Assets</h1>
              <p className="text-sm text-slate-400 mt-1.5">Sift through professional 4K UHD aerial photography examples and high-performing client templates.</p>
            </div>
            <DronePortfolio />
          </div>
        )}

        {activeSection === 'booking' && (
          <div className="space-y-4">
            <div className="border-b border-slate-900/60 pb-6 mb-8">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                <span>Services Configurator</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Local SEO & Drone Media Bundles</h1>
              <p className="text-sm text-slate-400 mt-1.5">Select a specialized local scaling plan and lock in your active consultation slot immediately.</p>
            </div>
            <PackageBooking />
          </div>
        )}

        {activeSection === 'google-form' && (
          <div className="space-y-4">
            <div className="border-b border-slate-900/60 pb-6 mb-8">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                <span>Intake Pipeline</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Google Forms Intake Questionnaire</h1>
              <p className="text-sm text-slate-400 mt-1.5">Input details for your custom design build to generate Gemini automated email sequences instantly.</p>
            </div>
            <DesignForm />
          </div>
        )}
      </main>

      {/* Floating Chatbot Assistant */}
      <Chatbot />

      {/* Modern Bento styled Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-[#06080e]/90 backdrop-blur-md py-12 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-extrabold text-slate-300 tracking-wider">LEE INTEGRATIONS.</span> All rights reserved. &copy; 2026.
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <span className="flex items-center space-x-1.5 bg-cyan-500/5 px-2.5 py-1 rounded-full border border-cyan-500/10 text-cyan-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>All Systems: Operational</span>
            </span>
            <a href="#" className="hover:text-slate-300 transition-colors py-1">Privacy Blueprint</a>
            <a href="#" className="hover:text-slate-300 transition-colors py-1">Terms of Operations</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
