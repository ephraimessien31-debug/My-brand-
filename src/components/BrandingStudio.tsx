import React, { useState } from 'react';
import { Sparkles, Layout, Palette, Type, ArrowRight, RefreshCw, Eye, Check } from 'lucide-react';

interface BrandingResult {
  tagline: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutHeader: string;
  aboutText: string;
  services: string[];
}

export default function BrandingStudio() {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [designPreference, setDesignPreference] = useState('Modern & Sleek');
  const [primaryColor, setPrimaryColor] = useState('#06b6d4'); // Cyan-500
  const [selectedTemplate, setSelectedTemplate] = useState('bento');
  const [loading, setLoading] = useState(false);
  const [branding, setBranding] = useState<BrandingResult | null>(null);

  const handleGenerateBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !businessType) return;

    setLoading(true);
    try {
      const response = await fetch('/api/gemini/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, businessType, designPreference }),
      });
      const data = await response.json();
      setBranding(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { id: 'bento', name: 'Bento Grid Layout', desc: 'Sleek bento style blocks' },
    { id: 'minimal', name: 'Organic Minimalist', desc: 'Focus on pure spacious spacing' },
    { id: 'bold', name: 'Futuristic Dark', desc: 'High contrast with neon glows' },
  ];

  return (
    <div id="branding-studio-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Input Form Column */}
      <div className="lg:col-span-5 glass-card rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Web & Branding Studio</h2>
              <p className="text-xs text-slate-400">Generate professional templates & customized branding instantly.</p>
            </div>
          </div>

          <form onSubmit={handleGenerateBranding} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Sprout Botanical Care"
                required
                className="w-full bg-[#06080e] border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Business Category</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. Modern Eco Cafe, Real Estate Agency"
                required
                className="w-full bg-[#06080e] border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Branding Style Preset</label>
              <select
                value={designPreference}
                onChange={(e) => setDesignPreference(e.target.value)}
                className="w-full bg-[#06080e] border border-white/10 focus:border-cyan-500 text-white rounded-xl px-4 py-3 text-sm transition-all focus:outline-none cursor-pointer"
              >
                <option value="Modern & Sleek">Modern & Sleek</option>
                <option value="Organic & Earthy">Organic & Earthy</option>
                <option value="Luxury & Elegant">Luxury & Elegant</option>
                <option value="Futuristic Tech">Futuristic Tech</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Brand Accent Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 bg-transparent border-0 rounded-lg cursor-pointer"
                />
                <span className="text-xs text-slate-400 font-mono uppercase">{primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Select Template Style</label>
              <div className="grid grid-cols-1 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      selectedTemplate === t.id
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                        : 'bg-[#06080e] border-white/10 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.desc}</div>
                    </div>
                    {selectedTemplate === t.id && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !businessName || !businessType}
              className="glossy-btn w-full flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/10 disabled:opacity-50 transition-all cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>AI Modeling Branding...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Template & Copy</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Live Interactive Preview Column */}
      <div className="lg:col-span-7 glass-card rounded-3xl p-6 relative flex flex-col justify-between overflow-hidden min-h-[500px]">
        {/* Absolute Glowing Elements */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Interactive Live Preview</span>
          </div>
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        {/* Dynamic Mockup Render */}
        <div className="flex-1 flex flex-col justify-center">
          {branding ? (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-6 transition-all duration-500">
              {/* Fake Nav */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-900">
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                  <span>{businessName}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium px-2 py-1 bg-slate-900 rounded-full">
                  {branding.tagline}
                </span>
              </div>

              {selectedTemplate === 'bento' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-extrabold text-white leading-tight" style={{ color: primaryColor }}>
                      {branding.heroTitle}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2">{branding.heroSubtitle}</p>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase">{branding.aboutHeader}</h4>
                    <p className="text-[10px] text-slate-300 mt-1 line-clamp-4 leading-relaxed">{branding.aboutText}</p>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase">Core Services</h4>
                    <ul className="text-[9px] text-slate-300 space-y-1.5 mt-2">
                      {branding.services.slice(0, 3).map((service, idx) => (
                        <li key={idx} className="flex items-start space-x-1">
                          <span className="text-emerald-400">✓</span>
                          <span>{service.split(' - ')[0]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedTemplate === 'minimal' && (
                <div className="space-y-4 py-2 text-center max-w-md mx-auto">
                  <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: primaryColor }}>
                    {branding.tagline}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">{branding.heroTitle}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{branding.heroSubtitle}</p>
                  <div className="h-[1px] bg-slate-900 my-4"></div>
                  <div className="text-left text-[10px] text-slate-300 leading-relaxed p-3 bg-slate-900/20 rounded-lg">
                    <strong>Our Purpose:</strong> {branding.description}
                  </div>
                </div>
              )}

              {selectedTemplate === 'bold' && (
                <div className="space-y-3">
                  <div className="relative p-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl" style={{ backgroundColor: primaryColor, opacity: 0.2 }}></div>
                    <h3 className="text-xl font-black text-white">{branding.heroTitle}</h3>
                    <p className="text-[11px] text-slate-400 mt-2">{branding.heroSubtitle}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {branding.services.slice(0, 3).map((serv, i) => (
                      <div key={i} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                        <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-[9px] mb-2 font-bold" style={{ color: primaryColor }}>
                          0{i + 1}
                        </div>
                        <h4 className="text-[9px] font-bold text-white line-clamp-1">{serv.split(' - ')[0]}</h4>
                        <p className="text-[8px] text-slate-500 line-clamp-2 mt-1">{serv.split(' - ')[1] || serv}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="p-4 bg-slate-900/60 rounded-full mb-4 border border-slate-800 animate-bounce">
                <Layout className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">No branding model loaded</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                Provide your Business Name and Category in the left panel to trigger our real-time Gemini template model.
              </p>
            </div>
          )}
        </div>

        {/* Small footer guidelines */}
        <div className="mt-6 border-t border-slate-800/80 pt-4 flex justify-between items-center text-[10px] text-slate-500">
          <span>Responsive Engine: v2.1</span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Gemini AI Connected</span>
          </span>
        </div>
      </div>
    </div>
  );
}
