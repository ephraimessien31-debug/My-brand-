import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  Calendar, 
  Clock, 
  Layers, 
  Camera, 
  BarChart3, 
  Target, 
  Percent, 
  ChevronRight, 
  Info,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Booking } from '../types';
import { auth } from '../lib/firebase.ts';

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  desc: string;
  features: string[];
}

interface ServiceCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  tiers: ServiceTier[];
}

interface Currency {
  code: string;
  symbol: string;
  rate: number;
  name: string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar ($)' },
  { code: 'NGN', symbol: '₦', rate: 1500, name: 'Nigerian Naira (₦)' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', rate: 0.78, name: 'British Pound (£)' },
];

export default function PackageBooking() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [latestBooking, setLatestBooking] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-07-15');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [customInstructions, setCustomInstructions] = useState('');

  // Selected Tiers state (keys: category ID, values: tier ID)
  const [selectedTiers, setSelectedTiers] = useState<Record<string, string>>({
    web: 'web-tier-2', // Default: Premium Bento Suite
    gbp: 'gbp-tier-2', // Default: Growth Elite
    drone: 'drone-tier-1', // Default: Standard Aerial Pack
    seo: 'seo-tier-1' // Default: Citation Cleanse
  });

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
  ];

  // Services Configuration
  const servicesData: ServiceCategory[] = [
    {
      id: 'web',
      title: 'Web Design & Interactive Systems',
      icon: Layers,
      tiers: [
        {
          id: 'web-tier-0',
          name: 'Skip Web Design',
          price: 0,
          desc: 'Keep your existing website structure unchanged.',
          features: []
        },
        {
          id: 'web-tier-1',
          name: 'Standard Boost (Landing Page)',
          price: 499,
          desc: 'Single-page responsive design built for instant lead capture.',
          features: [
            '1-Page responsive layout',
            'Interactive CTA anchor nodes',
            'Google Forms pipeline sync',
            'Full SSL setup & DNS matching'
          ]
        },
        {
          id: 'web-tier-2',
          name: 'Premium Domination (5-Page Suite)',
          price: 1299,
          desc: 'Beautiful bento-styled digital showcase representing your entire brand.',
          features: [
            '5-Page premium layout structure',
            'Motion layout animations',
            'Custom AI branding assets',
            'Strategic keyword layout maps'
          ]
        },
        {
          id: 'web-tier-3',
          name: 'Enterprise Portal (Custom App)',
          price: 2499,
          desc: 'Unlimited subpages, deep custom widgets, and complete automation integrations.',
          features: [
            'Unlimited custom components',
            'Interactive dashboard overlays',
            'Advanced schema integrations',
            'Dedicated client backend code'
          ]
        }
      ]
    },
    {
      id: 'gbp',
      title: 'Google Business Profile (GBP) SEO',
      icon: BarChart3,
      tiers: [
        {
          id: 'gbp-tier-0',
          name: 'Skip GBP Services',
          price: 0,
          desc: 'No GBP optimizations or responder sequences.',
          features: []
        },
        {
          id: 'gbp-tier-1',
          name: 'Essential Profile Setup',
          price: 199,
          desc: 'Claim, verify, and populate essential local categories.',
          features: [
            'Initial profile validation',
            'Strategic GEO tagging keywords',
            'NAP directory consistency',
            '1 Map Citation correction'
          ]
        },
        {
          id: 'gbp-tier-2',
          name: 'Growth Elite (Weekly Posts)',
          price: 399,
          desc: 'Automated keyword-optimized profile posts and AI-powered review responses.',
          features: [
            'Weekly custom keyword posts',
            'Gemini AI automated review replies',
            'Map citation health alerts',
            'Monthly authority statistics'
          ]
        },
        {
          id: 'gbp-tier-3',
          name: 'Local Domination (Daily Posts)',
          price: 699,
          desc: 'Uncompromising daily profile actions to outpace your direct search rivals.',
          features: [
            'Daily GBP picture & post updates',
            'Automated spam competitor removal',
            'Continuous organic authority building',
            'Instant GBP indexing telemetry'
          ]
        }
      ]
    },
    {
      id: 'drone',
      title: 'Professional Drone Photography & Video',
      icon: Camera,
      tiers: [
        {
          id: 'drone-tier-0',
          name: 'Skip Drone Media',
          price: 0,
          desc: 'No aerial media sessions.',
          features: []
        },
        {
          id: 'drone-tier-1',
          name: 'Standard Aerial Pack',
          price: 299,
          desc: 'High-resolution aerial perspectives highlighting your corporate facility.',
          features: [
            '5 Ultra HD 4K aerial photos',
            'Professional lighting corrections',
            'Unlimited commercial usage license',
            '48-Hour standard digital delivery'
          ]
        },
        {
          id: 'drone-tier-2',
          name: 'Cinematic Reel Suite',
          price: 599,
          desc: 'Exquisite cinematic drone video sequences with royalty-free music overlays.',
          features: [
            '10 4K aerial photographs',
            '60-second edited cinematic showcase',
            'Royalty-free music mixing',
            'Social media ratio presets (9:16 + 16:9)'
          ]
        },
        {
          id: 'drone-tier-3',
          name: 'Interactive 360 Media Suite',
          price: 999,
          desc: 'The ultimate immersive visual pack, combining 4K film and panoramic spaces.',
          features: [
            '15 UHD photos + Full commercial promo film',
            'Interactive 360 virtual space view',
            'Map pin annotations overlay',
            'Direct bento-grid website integration'
          ]
        }
      ]
    },
    {
      id: 'seo',
      title: 'Strategic Local SEO Campaigns',
      icon: Target,
      tiers: [
        {
          id: 'seo-tier-0',
          name: 'Skip SEO Services',
          price: 0,
          desc: 'No active local citation or backlinks campaigns.',
          features: []
        },
        {
          id: 'seo-tier-1',
          name: 'Citation Cleanse & Map Audit',
          price: 249,
          desc: 'Thorough directory audit to realign coordinates and remove duplicate listings.',
          features: [
            'Directory accuracy check',
            'NAP coordinate updates',
            'Top-tier citations setup',
            'Basic local competition audit'
          ]
        },
        {
          id: 'seo-tier-2',
          name: 'Authority Climb (Campaign Suite)',
          price: 499,
          desc: 'Launch foundational local citation networks and secure context backlinks.',
          features: [
            '50+ High-authority directory syncs',
            'Niche contextual backlink placements',
            'Weekly core keyword map tracking',
            'Local JSON-LD schema generation'
          ]
        },
        {
          id: 'seo-tier-3',
          name: 'Hyper-Local Metro Domination',
          price: 899,
          desc: 'Absolute search dominance covering your entire municipal region.',
          features: [
            '300+ Premium local directory listings',
            'Aggressive high-DA backlink acquire',
            'Location landing subpage maps',
            'Strategic local press syndication'
          ]
        }
      ]
    }
  ];

  // Retrieve current selected tiers objects
  const getSelectedServices = () => {
    return servicesData.map(cat => {
      const selectedId = selectedTiers[cat.id];
      const selectedTier = cat.tiers.find(t => t.id === selectedId) || cat.tiers[0];
      return {
        category: cat.title,
        categoryId: cat.id,
        ...selectedTier
      };
    });
  };

  const selectedServicesList = getSelectedServices();
  const activeServicesCount = selectedServicesList.filter(s => s.price > 0).length;

  // Compute subtotal
  const subtotal = selectedServicesList.reduce((acc, curr) => acc + curr.price, 0);

  // Compute discount percentage based on active integrations selected
  let discountPercent = 0;
  let discountName = 'No Bundle';

  if (activeServicesCount === 2) {
    discountPercent = 10;
    discountName = 'Dual Integration Discount (10% Off)';
  } else if (activeServicesCount === 3) {
    discountPercent = 15;
    discountName = 'Smarter Triple Bundle (15% Off)';
  } else if (activeServicesCount === 4) {
    discountPercent = 25;
    discountName = 'Full Domination Suite (25% Off!)';
  }

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalCost = subtotal - discountAmount;

  const fetchBookings = async () => {
    try {
      const headers: Record<string, string> = {};
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/bookings', { headers });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  useEffect(() => {
    // Re-fetch bookings whenever authentication state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchBookings();
    });
    return () => unsubscribe();
  }, []);

  const handleSelectTier = (categoryId: string, tierId: string) => {
    setSelectedTiers(prev => ({
      ...prev,
      [categoryId]: tierId
    }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !businessName) return;

    setSubmitting(true);

    // Prepare clean descriptive package summary
    const selectedItemSummaries = selectedServicesList
      .filter(s => s.price > 0)
      .map(s => {
        const converted = Math.round(s.price * selectedCurrency.rate);
        return `${s.name} (${selectedCurrency.symbol}${converted.toLocaleString()})`;
      })
      .join(', ');

    const convertedTotal = Math.round(totalCost * selectedCurrency.rate);
    const packageSummaryText = selectedItemSummaries 
      ? `Custom Bundle: [${selectedItemSummaries}] | Total: ${selectedCurrency.symbol}${convertedTotal.toLocaleString()} ${selectedCurrency.code} (${discountName})`
      : 'Consultation & Custom Quote Request';

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          email,
          businessName,
          packageName: packageSummaryText,
          scheduledDate: selectedDate,
          scheduledTime: selectedTime
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLatestBooking({
          ...data,
          subtotal,
          discountPercent,
          discountAmount,
          totalCost,
          selectedServicesList: selectedServicesList.filter(s => s.price > 0),
          currency: selectedCurrency
        });
        setSuccess(true);
        setName('');
        setEmail('');
        setBusinessName('');
        setCustomInstructions('');
        fetchBookings();
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="service-package-builder-root" className="space-y-10">
      
      {/* Intro Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Percent className="h-4.5 w-4.5 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-widest font-mono">Dynamic Multi-System Discounts</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">LEE INTEGRATIONS Custom Suite Configurator</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure your enterprise systems, drone media, and search footprint instantly. Build a custom package below by choosing your ideal tier for each sector. Combine integrations to unlock instant smart multi-tier discounts up to <span className="text-cyan-400 font-bold">25% off</span>.
          </p>
        </div>
        
        {/* Promotion highlights */}
        <div className="bg-[#06080e] p-4 rounded-2xl border border-white/5 shrink-0 w-full md:w-64 space-y-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Active Promo Mechanics</span>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">2 Systems:</span>
            <span className="text-cyan-400 font-bold">10% Off</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">3 Systems:</span>
            <span className="text-cyan-400 font-bold">15% Off</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">All 4 Systems:</span>
            <span className="text-cyan-400 font-bold">25% Off!</span>
          </div>
        </div>
      </div>
      
      {/* Currency Selector Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#06080e]/60 border border-white/5 rounded-3xl gap-3">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">Preferred Display Currency:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              type="button"
              onClick={() => setSelectedCurrency(curr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedCurrency.code === curr.code
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/40 text-slate-400 border-white/5 hover:text-white hover:bg-slate-950/80'
              }`}
            >
              <span className="mr-1">{curr.symbol}</span>
              <span>{curr.code}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Tiers Selection Configurator */}
        <div className="lg:col-span-8 space-y-8">
          {servicesData.map((serviceCat) => {
            const IconComponent = serviceCat.icon;
            const currentSelectedId = selectedTiers[serviceCat.id];

            return (
              <div 
                key={serviceCat.id} 
                className="glass-card rounded-3xl p-6 space-y-4 shadow-sm"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{serviceCat.title}</h3>
                      <p className="text-[10px] text-slate-500">Choose one option to configure this sector.</p>
                    </div>
                  </div>
                  
                  {/* Selected Indicator */}
                  <div>
                    {currentSelectedId.endsWith('tier-0') ? (
                      <span className="text-[9px] uppercase font-black px-2 py-1 bg-slate-950 text-slate-500 rounded border border-slate-850">
                        Skipped
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-black px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20">
                        Configured
                      </span>
                    )}
                  </div>
                </div>

                {/* Tiers Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                  {serviceCat.tiers.map((tier) => {
                    const isSelected = currentSelectedId === tier.id;
                    const isSkip = tier.price === 0;

                    return (
                      <div
                        key={tier.id}
                        onClick={() => handleSelectTier(serviceCat.id, tier.id)}
                        className={`group relative p-4 rounded-2xl cursor-pointer flex flex-col justify-between transition-all duration-300 border h-[240px] select-none ${
                          isSelected
                            ? 'bg-[#06080e] border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                            : 'bg-[#030407]/40 border-white/5 hover:border-white/20 hover:bg-[#030407]/80'
                        }`}
                      >
                        {/* Selector indicator bubble */}
                        <div className="absolute top-3 right-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-cyan-500 border-cyan-500 text-slate-950'
                              : 'border-slate-750 group-hover:border-slate-500'
                          }`}>
                            {isSelected && <Check className="h-2.5 w-2.5 stroke-[4]" />}
                          </div>
                        </div>

                        <div>
                          {/* Price */}
                          <div className="mb-2">
                            {isSkip ? (
                              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                                Skip Sector
                              </span>
                            ) : (
                              <div className="flex items-baseline space-x-0.5">
                                <span className="text-lg font-black text-cyan-400">{selectedCurrency.symbol}</span>
                                <span className="text-2xl font-black text-white tracking-tight">
                                  {Math.round(tier.price * selectedCurrency.rate).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Name & Desc */}
                          <h4 className={`text-xs font-bold leading-tight transition-colors ${
                            isSelected ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'
                          }`}>
                            {tier.name}
                          </h4>
                          
                          <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                            {tier.desc}
                          </p>
                        </div>

                        {/* Miniature feature tags */}
                        {!isSkip && tier.features.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-900/60 space-y-1">
                            <span className="text-[8px] uppercase font-bold text-slate-500 block tracking-widest">Includes</span>
                            <div className="space-y-0.5">
                              {tier.features.slice(0, 2).map((feat, i) => (
                                <div key={i} className="flex items-center space-x-1 text-[9px] text-slate-300 truncate">
                                  <span className="w-1 h-1 bg-cyan-400 rounded-full shrink-0"></span>
                                  <span className="truncate">{feat}</span>
                                </div>
                              ))}
                              {tier.features.length > 2 && (
                                <span className="text-[8px] text-slate-500 font-medium block">+{tier.features.length - 2} more features</span>
                              )}
                            </div>
                          </div>
                        )}

                        {isSkip && (
                          <div className="mt-3 text-[9px] text-slate-600 italic">
                            Select other tiers to customize
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Dynamic Invoice Summary & Submission Form */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          
          {/* Live Bill Card */}
          <div className="glass-card rounded-3xl p-6 space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <h3 className="font-bold text-sm text-white uppercase tracking-widest pb-3.5 border-b border-slate-850 flex items-center justify-between">
              <span>Integration Proposal</span>
              <span className="text-[10px] bg-slate-950 text-slate-400 px-2.5 py-0.5 rounded-full font-mono border border-slate-850">
                Live Draft
              </span>
            </h3>

            {/* Itemized List */}
            <div className="space-y-3">
              {selectedServicesList.map((item) => {
                const isSkip = item.price === 0;
                return (
                  <div key={item.categoryId} className="flex items-start justify-between text-xs py-1">
                    <div className="max-w-[70%]">
                      <span className="text-[9px] text-slate-500 uppercase block tracking-wider font-semibold">
                        {item.category.split(' ')[0]} Integration
                      </span>
                      <span className={`font-medium block truncate ${isSkip ? 'text-slate-600 italic' : 'text-slate-200'}`}>
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      {isSkip ? (
                        <span className="text-slate-600 font-mono">-</span>
                      ) : (
                        <span className="font-bold font-mono text-slate-300">
                          {selectedCurrency.symbol}{Math.round(item.price * selectedCurrency.rate).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations block */}
            <div className="pt-4 border-t border-slate-850 space-y-2.5">
              
              {/* Subtotal */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Services Subtotal</span>
                <span className="font-bold font-mono text-slate-200">
                  {selectedCurrency.symbol}{Math.round(subtotal * selectedCurrency.rate).toLocaleString()}
                </span>
              </div>

              {/* Bundle Discount Applied */}
              {discountPercent > 0 && (
                <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <Percent className="h-3.5 w-3.5" />
                    <div>
                      <span className="font-bold block text-[10px] uppercase tracking-wider">{discountName}</span>
                      <span className="text-[9px] text-slate-400 block">Smart Bundle algorithm active</span>
                    </div>
                  </div>
                  <span className="font-extrabold font-mono text-cyan-400">
                    -{selectedCurrency.symbol}{Math.round(discountAmount * selectedCurrency.rate).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Grand Total */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <div>
                  <span className="text-xs font-bold text-white block">Grand Total Cost</span>
                  <span className="text-[9px] text-slate-500 block">VAT & SSL configs included</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-cyan-400 tracking-tight font-mono filter drop-shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                    {selectedCurrency.symbol}{Math.round(totalCost * selectedCurrency.rate).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact details Onboarding form */}
            <div className="pt-4 border-t border-slate-850 space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                Secure This Configuration
              </span>

              <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Contact Name"
                    className="w-full bg-[#030407] border border-white/10 focus:border-cyan-500 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Business Email"
                    className="w-full bg-[#030407] border border-white/10 focus:border-cyan-500 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Company / Business Name"
                    className="w-full bg-[#030407] border border-white/10 focus:border-cyan-500 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                </div>

                {/* Scheduling info */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] uppercase font-bold text-slate-500 block mb-1">Target Launch/Meet Date</label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#030407] border border-white/10 focus:border-cyan-500 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] uppercase font-bold text-slate-500 block mb-1">Preferred Time Block</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-[#030407] border border-white/10 focus:border-cyan-500 text-white rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                    >
                      {timeSlots.map(t => (
                        <option key={t} value={t} className="bg-slate-950 text-slate-300">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Any specific integration requirements or questions? (Optional)"
                    rows={2}
                    className="w-full bg-[#030407] border border-white/10 focus:border-cyan-500 text-white rounded-xl px-3.5 py-2 text-[11px] focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting || subtotal === 0}
                  className="glossy-btn w-full flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/15 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs uppercase tracking-wider"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{submitting ? 'Drafting Proposal...' : 'Secure Suite Proposal'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Booking list overview underneath */}
      {bookings.length > 0 && (
        <div className="bg-slate-900/10 border border-slate-850 rounded-3xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-850 mb-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-cyan-400" />
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">Active Client Suites (In Database)</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-bold font-mono">{bookings.length} Registered Proposals</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-1">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-white block truncate max-w-[80%]">{booking.businessName}</span>
                    <span className="text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-black uppercase shrink-0">
                      {booking.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Contact: {booking.name}</span>
                  
                  {/* Package description parsing / layout */}
                  <p className="text-[9px] text-slate-500 mt-2 line-clamp-2 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-850/40">
                    {booking.packageName}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 text-[9px] text-slate-500 font-mono">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-slate-600" />
                    <span>{booking.scheduledDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-slate-600" />
                    <span>{booking.scheduledTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Modal / Digital Receipt Overlay */}
      {success && latestBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-fade-in">
            
            {/* Visual Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center justify-center mx-auto mb-2 filter drop-shadow-[0_0_8px_rgba(52,211,153,0.2)]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Proposal Confirmed!</h3>
              <p className="text-xs text-slate-400">
                Your custom integrations proposal has been safely logged in the LEE INTEGRATIONS master register.
              </p>
            </div>

            {/* Digital Receipt Sheet */}
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-850 text-xs font-mono space-y-4 shadow-inner">
              <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-900">
                <span>Receipt Ref: #{latestBooking.id}</span>
                <span>UTC CONFIRMED</span>
              </div>

              {/* Summary specifications */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Business:</span>
                  <span className="text-white font-bold">{latestBooking.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Primary contact:</span>
                  <span className="text-white font-bold">{latestBooking.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Target Session:</span>
                  <span className="text-cyan-400 font-bold">{latestBooking.scheduledDate} @ {latestBooking.scheduledTime}</span>
                </div>
              </div>

              {/* Selected systems breakdown */}
              <div className="pt-3 border-t border-slate-900 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block tracking-widest">Configured Tiers</span>
                {latestBooking.selectedServicesList.map((srv: any, index: number) => {
                  const curr = latestBooking.currency || currencies[0];
                  return (
                    <div key={index} className="flex justify-between text-[11px]">
                      <span className="text-slate-300 font-sans">{srv.name}</span>
                      <span className="text-slate-200">
                        {curr.symbol}{Math.round(srv.price * curr.rate).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals billing area */}
              <div className="pt-3 border-t border-slate-900 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>
                    {(latestBooking.currency || currencies[0]).symbol}
                    {Math.round(latestBooking.subtotal * (latestBooking.currency || currencies[0]).rate).toLocaleString()}
                  </span>
                </div>
                {latestBooking.discountPercent > 0 && (
                  <div className="flex justify-between text-cyan-400 font-bold">
                    <span>Bundle Discount ({latestBooking.discountPercent}%):</span>
                    <span>
                      -{(latestBooking.currency || currencies[0]).symbol}
                      {Math.round(latestBooking.discountAmount * (latestBooking.currency || currencies[0]).rate).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-white text-sm font-black pt-2 border-t border-slate-900/40">
                  <span className="font-sans uppercase font-black text-xs tracking-wider">Final Total:</span>
                  <span className="text-cyan-400 text-lg">
                    {(latestBooking.currency || currencies[0]).symbol}
                    {Math.round(latestBooking.totalCost * (latestBooking.currency || currencies[0]).rate).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSuccess(false)}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                Done & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
