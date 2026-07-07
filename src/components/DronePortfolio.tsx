import React, { useState } from 'react';
import { Camera, Layers, Play, Eye, Compass, Award, ZoomIn, Heart, ExternalLink } from 'lucide-react';

export default function DronePortfolio() {
  const [activeTab, setActiveTab] = useState<'drone' | 'web'>('drone');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const droneWorks = [
    {
      id: 'd-1',
      title: 'Ocean Crest Luxury Resort',
      category: 'Real Estate Aerials',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800',
      specs: '4K Ultra HD @ 60fps | Cinematic Flyover',
      description: 'Stunning sunset flyby showcase of an elite hospitality resort capturing coastal property lines and amenities.'
    },
    {
      id: 'd-2',
      title: 'Summit Office Park',
      category: 'Commercial Buildings',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      specs: '20MP High-Res RAW Photos | Orthomosaic Map',
      description: 'Precision industrial mapping and promotional high-altitude photography for a multi-tenant commercial center.'
    },
    {
      id: 'd-3',
      title: 'Vanguard Industrial Hub',
      category: 'Construction Progress',
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
      specs: '4K Detailed Survey | Weekly Progress Pack',
      description: 'Bi-weekly high-resolution aerial monitoring showcasing structural developments and equipment positioning.'
    },
    {
      id: 'd-4',
      title: 'Metro Hub HQ',
      category: 'Corporate Office Shoots',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      specs: 'Active FPV Fly-Through | Internal Media',
      description: 'Indoor FPV drone cinematic fly-through highlighting contemporary design spaces and workspace dynamics.'
    }
  ];

  const webWorks = [
    {
      id: 'w-1',
      title: 'Apex Law Associates',
      category: 'Professional Services',
      theme: 'Corporate Slate Theme',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
      description: 'High-converting custom web platform containing automated intake questionnaires, reviews widget, and consultation schedulers.'
    },
    {
      id: 'w-2',
      title: 'Boreal Coffee Co.',
      category: 'Local Hospitality',
      theme: 'Organic Earthy Vibe',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
      description: 'AI-guided minimalist branding interface displaying daily specials, customer loyalty forms, and Google Map integration.'
    },
    {
      id: 'w-3',
      title: 'Thera Spa & Wellness',
      category: 'Health & Beauty',
      theme: 'Luxury Lavish Pastel',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
      description: 'Sleek bento layout website centered around gift card purchases, live therapist bios, and integrated scheduler packages.'
    }
  ];

  const portfolioList = activeTab === 'drone' ? droneWorks : webWorks;

  return (
    <div id="portfolio-container" className="space-y-6">
      {/* Portfolio Selector & Bento Header */}
      <div className="glass-card rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-2xl">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Media & Designs Showcase</h2>
            <p className="text-xs text-slate-400">High-resolution drone photography and custom business websites.</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-2 bg-[#06080e] p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('drone')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'drone'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Drone Photography</span>
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'web'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>AI Web Design Templates</span>
          </button>
        </div>
      </div>

      {/* Grid of Portfolio items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {portfolioList.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`group glass-card rounded-3xl overflow-hidden cursor-pointer hover:border-cyan-500/35 transition-all duration-300 flex flex-col justify-between ${
              activeTab === 'drone'
                ? idx === 0 || idx === 3 ? 'lg:col-span-7' : 'lg:col-span-5'
                : idx === 0 ? 'lg:col-span-4' : idx === 1 ? 'lg:col-span-4' : 'lg:col-span-4'
            }`}
          >
            <div className="relative overflow-hidden aspect-video w-full bg-[#06080e]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080e] via-transparent to-transparent opacity-60"></div>
              
              {/* Media badge */}
              <span className="absolute top-4 left-4 bg-slate-950/80 border border-white/10 text-slate-300 px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider">
                {item.category}
              </span>

              {/* View Overlay icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40">
                <div className="p-3 bg-cyan-500 text-slate-950 rounded-full shadow-lg">
                  <ZoomIn className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors leading-snug">
                  {item.title}
                </h3>
                {activeTab === 'web' && (
                  <span className="text-[10px] text-cyan-400 font-bold block mt-1 uppercase tracking-wider">
                    {item.theme}
                  </span>
                )}
                <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-medium truncate max-w-[200px]">
                  {activeTab === 'drone' ? item.specs : 'Delivered in 48 Hours'}
                </span>
                <span className="text-cyan-400 font-bold uppercase tracking-widest flex items-center space-x-1">
                  <span>Explore</span>
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Elegant Portfolio Modal overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="glass-card rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 bg-slate-950/85 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-800 z-10"
            >
              Close Showcase
            </button>

            <img
              src={selectedItem.image}
              alt={selectedItem.title}
              className="w-full aspect-video object-cover"
            />

            <div className="p-6 text-white">
              <span className="text-cyan-400 text-xs font-extrabold uppercase tracking-widest block mb-1">
                {selectedItem.category}
              </span>
              <h3 className="text-xl font-extrabold text-white">{selectedItem.title}</h3>
              
              <p className="text-slate-300 text-xs mt-3 leading-relaxed font-medium">
                {selectedItem.description}
              </p>

              {activeTab === 'drone' ? (
                <div className="mt-5 p-4 bg-slate-950 rounded-2xl border border-slate-850 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Equipment Specs</span>
                    <span className="text-xs font-bold text-slate-200 mt-0.5 block">{selectedItem.specs}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded-lg border border-cyan-500/20">
                      HDR Content
                    </span>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20">
                      60 FPS UHD
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-4 bg-slate-950 rounded-2xl border border-slate-850 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Deployment Structure</span>
                    <span className="text-xs font-bold text-slate-200 mt-0.5 block">AI-Generated Landing Page Preset</span>
                  </div>
                  <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20">
                    SEO Configured
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
