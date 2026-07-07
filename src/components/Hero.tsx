import React from 'react';
import { Shield, Sparkles, Navigation, Layers, ChevronRight, Zap, Target, Award } from 'lucide-react';
import Logo from './Logo';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="relative overflow-hidden text-white pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Gradients & Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          {/* Text content */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            {/* Visual Brand Identity Logo */}
            <div className="flex justify-center lg:justify-start mb-6">
              <Logo size="md" showSlogan={true} />
            </div>

            <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/25 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm shadow-cyan-500/5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Complete Local Dominance Suite</span>
            </div>
            <h1 className="text-4xl tracking-tight font-black text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-tight">
              <span className="block">Websites with AI.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500">
                Media with Drones.
              </span>
              <span className="block">SEO with Authority.</span>
            </h1>
            <p className="mt-4 text-base text-slate-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl leading-relaxed">
              We engineer beautiful web presences using custom AI template generators, capture breathtaking professional aerial photographs with advanced drones, and launch strategic local SEO marketing that lands your business in Google's Map Pack.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                id="hero-cta-ai"
                onClick={() => onNavigate('branding')}
                className="glossy-btn flex items-center justify-center space-x-2 px-7 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-extrabold shadow-lg shadow-cyan-500/20 text-slate-950 text-sm cursor-pointer"
              >
                <span>Try AI Template Builder</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                id="hero-cta-booking"
                onClick={() => onNavigate('booking')}
                className="glossy-btn flex items-center justify-center space-x-2 px-7 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold border border-white/10 hover:border-white/20 transition-all text-white text-sm shadow-md cursor-pointer"
              >
                <span>Book Local SEO Package</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-12 border-t border-white/5 pt-8 grid grid-cols-3 gap-4">
              <div>
                <span className="block text-2xl font-black text-white">48 Hours</span>
                <span className="block text-xs text-slate-400 mt-1">AI Template Delivery</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">4K UHD</span>
                <span className="block text-xs text-slate-400 mt-1">Professional Drone Media</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-white">Top 3</span>
                <span className="block text-xs text-slate-400 mt-1">Google Local SEO Ranking</span>
              </div>
            </div>
          </div>

          {/* Graphical Mockup / Feature Grid */}
          <div className="mt-12 lg:mt-0 lg:col-span-6 relative">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden glass-card p-6 shadow-2xl">
              
              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#06080e]/80 p-4.5 rounded-2xl border border-white/5 hover:border-cyan-500/35 transition-all duration-300 group">
                  <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 w-fit mb-3 group-hover:bg-cyan-500/20 border border-cyan-500/10">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-white">AI Templates & Branding</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Custom designs, custom taglines, and professional copy tailored in seconds.
                  </p>
                </div>

                <div className="bg-[#06080e]/80 p-4.5 rounded-2xl border border-white/5 hover:border-cyan-500/35 transition-all duration-300 group">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 w-fit mb-3 group-hover:bg-blue-500/20 border border-blue-500/10">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-white">Google Profile Management</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Automated review response sequences and daily local post creation.
                  </p>
                </div>

                <div className="bg-[#06080e]/80 p-4.5 rounded-2xl border border-white/5 hover:border-cyan-500/35 transition-all duration-300 group">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 w-fit mb-3 group-hover:bg-amber-500/20 border border-amber-500/10">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-white">4K Drone Services</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Showcase your office, facilities, and physical structures from the air.
                  </p>
                </div>

                <div className="bg-[#06080e]/80 p-4.5 rounded-2xl border border-white/5 hover:border-cyan-500/35 transition-all duration-300 group">
                  <div className="p-2.5 bg-green-500/10 rounded-xl text-green-400 w-fit mb-3 group-hover:bg-green-500/20 border border-green-500/10">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-white">Local SEO Packages</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Complete optimization, mapping coordinates, citation updates, and local ranking.
                  </p>
                </div>
              </div>

              {/* Promo Interactive Sub-banner */}
              <div className="mt-6 p-4.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-between shadow-inner">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-extrabold text-xs border border-cyan-500/20">
                    %
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Local Boost Promo</h4>
                    <p className="text-[10px] text-slate-400">Get free drone package with local optimization.</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('booking')}
                  className="glossy-btn px-4 py-2 bg-cyan-500 text-slate-950 text-[10px] font-extrabold rounded-lg hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  View Pack
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
