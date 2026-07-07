import React, { useState, useEffect } from 'react';
import { FileText, Mail, Send, ChevronRight, Check, Sparkles, AlertCircle, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import { FormSubmission } from '../types';
import { auth } from '../lib/firebase.ts';

export default function DesignForm() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [designPreference, setDesignPreference] = useState('Minimalist & Organic');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Online Bookings']);
  const [primaryColor, setPrimaryColor] = useState('#06b6d4');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sequenceDispatched, setSequenceDispatched] = useState(false);
  
  // Generated Email Sequence State
  const [emailSequence, setEmailSequence] = useState<{
    email1: { subject: string; body: string };
    email2: { subject: string; body: string };
    email3: { subject: string; body: string };
  } | null>(null);
  
  const [activeEmailTab, setActiveEmailTab] = useState<'email1' | 'email2' | 'email3'>('email1');

  const featureOptions = [
    'Online Bookings',
    'Trainer/Staff Bios',
    'Customer Review Feed',
    'Drone Media Gallery',
    'Google Maps Pack Embed',
    'Intelligent CRM Chatbot'
  ];

  const fetchSubmissions = async () => {
    try {
      const headers: Record<string, string> = {};
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/submissions', { headers });
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Re-fetch submissions whenever authentication state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchSubmissions();
    });
    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !businessType || !email) return;

    setLoading(true);
    setSuccess(false);
    setEmailSequence(null);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      // 1. Post questionnaire submission
      const subRes = await fetch('/api/submissions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          businessName,
          businessType,
          designPreference,
          keyFeatures: selectedFeatures,
          primaryColor,
          email,
        }),
      });

      if (subRes.ok) {
        setSuccess(true);
        // 2. Fetch submissions list
        fetchSubmissions();

        // 3. Trigger Gemini automated email sequence generation
        const emailRes = await fetch('/api/gemini/email-sequence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName,
            businessType,
            designPreference,
            keyFeatures: selectedFeatures,
            primaryColor,
            email,
          }),
        });
        const sequenceData = await emailRes.json();
        setEmailSequence(sequenceData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="design-form-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Questionnaire Input Card (styled like Google Form branding) */}
      <div className="lg:col-span-6 glass-card rounded-3xl p-6 relative overflow-hidden">
        {/* Decorative Google Forms Purple Strip Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500"></div>

        <div className="flex items-center space-x-2.5 mb-6 pt-2">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Google Web Design Intake</h2>
            <p className="text-xs text-slate-400">Provide preferences. This triggers automated onboarding sequences.</p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Business / Company Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Sprout Wellness Lab"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">What category or industry?</label>
            <input
              type="text"
              required
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Modern Wellness & Yoga Studio"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Design Preference</label>
              <select
                value={designPreference}
                onChange={(e) => setDesignPreference(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer"
              >
                <option value="Minimalist & Organic">Minimalist & Organic</option>
                <option value="Clean Bento Grid">Clean Bento Grid</option>
                <option value="Vibrant Dark Cyber">Vibrant Dark Cyber</option>
                <option value="Classic Editorial">Classic Editorial</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Notification Contact Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@sprout.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Key features checklist */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Requested Core Features</label>
            <div className="grid grid-cols-2 gap-2">
              {featureOptions.map((feat) => {
                const isChecked = selectedFeatures.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => handleCheckboxChange(feat)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded flex items-center justify-center border ${
                      isChecked ? 'bg-indigo-500 border-indigo-500 text-slate-950' : 'border-slate-800'
                    }`}>
                      {isChecked && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span>{feat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !businessName || !businessType || !email}
            className="w-full flex items-center justify-center space-x-2 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all cursor-pointer text-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating Onboarding Alert sequences...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Submit Intake Questionnaire</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Automated Email Sequences Inbox Mockup */}
      <div className="lg:col-span-6 glass-card rounded-3xl p-6 flex flex-col justify-between min-h-[500px]">
        <div>
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-850">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-sm text-white">Automated Campaign sequences</h3>
                <p className="text-xs text-slate-400">Inspect the dynamic customer emails triggered on submission.</p>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2.5 py-1 rounded-full font-bold">
              3 Sequences Active
            </span>
          </div>

          {emailSequence ? (
            <div className="space-y-4">
              {/* Campaign Email Tabs */}
              <div className="flex space-x-1.5 bg-[#06080e] p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveEmailTab('email1')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                    activeEmailTab === 'email1'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Email 1 (Instant)
                </button>
                <button
                  onClick={() => setActiveEmailTab('email2')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                    activeEmailTab === 'email2'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Email 2 (+24 Hours)
                </button>
                <button
                  onClick={() => setActiveEmailTab('email3')}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                    activeEmailTab === 'email3'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Email 3 (+48 Hours)
                </button>
              </div>

              {/* Active Email View Render */}
              <div className="bg-[#06080e] rounded-2xl border border-white/5 p-5 shadow-2xl relative">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5 text-xs">
                  <div>
                    <span className="text-slate-500 block">From:</span>
                    <span className="font-bold text-slate-300">AeroSite Studio Team &lt;onboarding@aerosite.com&gt;</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/25">
                    Automated
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-slate-500 text-xs block">Subject:</span>
                  <span className="font-extrabold text-xs text-white leading-relaxed">
                    {emailSequence[activeEmailTab].subject}
                  </span>
                </div>

                <div className="bg-[#030407]/60 rounded-xl p-4 border border-white/5 max-h-[220px] overflow-y-auto">
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
                    {emailSequence[activeEmailTab].body}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  {sequenceDispatched ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
                      <CheckCircle className="h-3 w-3" />
                      <span>Test email sent successfully!</span>
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <button
                    onClick={() => {
                      setSequenceDispatched(true);
                      setTimeout(() => setSequenceDispatched(false), 3000);
                    }}
                    className="glossy-btn flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Send Test Email</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center flex-1">
              <div className="p-4 bg-slate-950/60 rounded-full border border-slate-850 mb-3 text-indigo-400 animate-pulse">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="text-xs font-bold text-slate-300">No active campaign triggers</h3>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed mt-2">
                Submit the Google Design questionnaire on the left to trigger real-time onboarding email marketing chains.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic submissions count list */}
        <div className="mt-6 border-t border-slate-850/60 pt-4 text-[10px] text-slate-500 flex justify-between items-center">
          <span>Google Drive Synced</span>
          <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Gmail Service Online</span>
          </span>
        </div>
      </div>
    </div>
  );
}
