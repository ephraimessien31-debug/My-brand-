import React from 'react';
import { Layers, Camera, BarChart3, Calendar, FileText, Bot, Compass, Star, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface BentoDashboardProps {
  onNavigate: (section: string) => void;
}

export default function BentoDashboard({ onNavigate }: BentoDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Dynamic Grid Layout matching the Bento Grid template */}
      <div className="grid grid-cols-12 gap-5 auto-rows-[125px] lg:auto-rows-[140px]">
        
        {/* Main Banner Block (col-span-8 row-span-3) */}
        <div className="col-span-12 lg:col-span-8 row-span-3 glass-card rounded-3xl p-6 lg:p-8 relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="#3B82F6" d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,77.3,-44.7C85.4,-31.3,90.4,-15.7,89.5,-0.5C88.6,14.6,81.7,29.3,72.4,42.1C63.2,54.9,51.6,65.8,38.1,72.8C24.7,79.8,9.3,83,-6.2,81.7C-21.7,80.5,-37.3,74.9,-50.4,65.8C-63.4,56.7,-73.9,44,-79.8,29.6C-85.7,15.2,-87,-0.9,-83.8,-15.8C-80.6,-30.7,-72.9,-44.3,-61.7,-52.3C-50.5,-60.3,-35.8,-62.7,-22.4,-69.9C-9,-77.1,3.1,-89.1,19.3,-88.4C35.5,-87.6,31.4,-83.7,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          <div className="relative z-10">
            <span className="px-3 py-1 bg-cyan-400/10 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/20 uppercase tracking-widest">
              AI Web Systems
            </span>
            <h1 className="text-3xl lg:text-5xl font-black mt-4 text-white leading-tight tracking-tight">
              Websites that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                Build Themselves.
              </span>
            </h1>
            <p className="text-slate-400 text-xs lg:text-sm mt-3 max-w-md leading-relaxed">
              Deploy custom-branded, high-converting templates powered by neural design engines. Seamlessly integrated with Google Forms for automated workflows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 relative z-10">
            <div className="px-3.5 py-2 bg-[#0d121e]/80 rounded-xl border border-white/5 flex items-center gap-2.5">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-semibold text-slate-300">Automated Onboarding Sequence Triggered</span>
            </div>
            
            <button
              onClick={() => onNavigate('branding')}
              className="glossy-btn flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold rounded-full hover:from-cyan-400 hover:to-blue-500 hover:text-slate-950 transition-all cursor-pointer shadow-md shadow-cyan-500/10"
            >
              <span>Launch Builder</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* AI Booking Concierge Card (col-span-4 row-span-4) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 row-span-4 glass-card rounded-3xl p-6 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-extrabold text-[11px] text-white uppercase tracking-wider">AI Booking Concierge</span>
              </div>
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">Live 24/7</span>
            </div>

            <div className="space-y-3.5">
              <div className="bg-[#06080e]/90 p-3.5 rounded-2xl rounded-tl-none text-[11px] text-slate-300 leading-relaxed border border-white/5">
                Hello! I can help you book a drone shoot or a website consultation. What are you looking for today?
              </div>
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-3.5 rounded-2xl rounded-tr-none text-[11px] text-cyan-300 font-medium leading-relaxed">
                I need a professional drone session for my new real estate listing.
              </div>
              <div className="bg-[#06080e]/90 p-3.5 rounded-2xl rounded-tl-none text-[11px] text-slate-300 leading-relaxed border border-white/5">
                Perfect. We have availability this Thursday. Should I block that for you?
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="p-3.5 bg-[#06080e]/95 border border-white/5 rounded-2xl flex justify-between items-center mb-3">
              <span className="text-[10px] text-slate-500 font-medium">Ask our AI chatbot anything...</span>
              <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-black text-[10px] border border-cyan-500/20">
                AI
              </div>
            </div>
            
            <button
              onClick={() => {
                const button = document.getElementById('chatbot-launcher');
                if (button) button.click();
              }}
              className="glossy-btn w-full py-3 bg-[#0c111d] hover:bg-[#121829] text-slate-300 hover:text-white hover:border-cyan-500/30 transition-colors rounded-xl text-xs font-bold border border-white/5 flex items-center justify-center space-x-1.5"
            >
              <Bot className="h-4 w-4" />
              <span>Initiate Chat Assistant</span>
            </button>
          </div>
        </div>

        {/* Drone Services Card (col-span-4 row-span-3) */}
        <div
          onClick={() => onNavigate('portfolio')}
          className="col-span-12 md:col-span-6 lg:col-span-4 row-span-3 glass-card rounded-3xl overflow-hidden group cursor-pointer flex flex-col justify-between"
        >
          <div className="h-32 bg-[url('https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-transparent to-transparent"></div>
            <span className="absolute bottom-3 left-4 bg-[#06080e]/90 text-[8px] font-black uppercase text-cyan-400 border border-white/10 px-2.5 py-1 rounded-md tracking-wider backdrop-blur-sm">
              High Resolution
            </span>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">Professional Drone Services</h3>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                4K Aerial Photography & Cinematic 60fps video for corporate structures & real estate listings.
              </p>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-[9px] text-slate-500 border-t border-white/5 pt-3">
              <span className="font-bold uppercase tracking-wider text-cyan-400/90 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                <span>View Drone Media Portfolio</span>
                <span>&rarr;</span>
              </span>
            </div>
          </div>
        </div>

        {/* Local SEO Elite Card (col-span-4 row-span-2) */}
        <div
          onClick={() => onNavigate('booking')}
          className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 glass-card rounded-3xl p-6 flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#06080e] rounded-xl border border-white/10 flex items-center justify-center text-cyan-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Local SEO Domination</h4>
              <p className="text-[9px] text-slate-400 mt-0.5">Rank #1 in your local business area.</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center text-[9px] text-slate-400 mb-1.5 font-semibold">
              <span>SEO Optimization Progress</span>
              <span className="text-cyan-400 font-bold bg-cyan-400/5 px-1.5 py-0.5 rounded border border-cyan-400/10">95% authority</span>
            </div>
            <div className="bg-[#06080e] h-2 rounded-full border border-white/5 overflow-hidden">
              <div className="w-11/12 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Google Profile reviews & clients statistics (col-span-4 row-span-2) */}
        <div
          onClick={() => onNavigate('gbp')}
          className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 glass-card rounded-3xl p-6 flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-xs font-bold text-white">Google Profiles (GBP)</h4>
              <p className="text-[10px] text-slate-400 mt-1">Review responder & daily local updates.</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-400 text-xs font-black">
              <Star className="h-3 w-3 fill-amber-400 shrink-0 text-amber-400" />
              <span>★ 4.9</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-[#06080e]"></div>
              <div className="w-6 h-6 rounded-full bg-slate-700 border border-[#06080e]"></div>
              <div className="w-6 h-6 rounded-full bg-slate-600 border border-[#06080e]"></div>
            </div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-cyan-400 transition-colors flex items-center gap-1">
              <span>Manage Google Profiles</span>
              <span>&rarr;</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
