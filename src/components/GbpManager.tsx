import React, { useState } from 'react';
import { Star, MessageSquare, Sparkles, Send, MapPin, CheckCircle, Trophy, BarChart3, TrendingUp, Zap } from 'lucide-react';
import { Review } from '../types';

export default function GbpManager() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'David Peterson',
      rating: 5,
      comment: 'Excellent customer service and top quality work. AeroSite helped optimize our local business profile and the drone shots are stunning.',
      replyText: '',
    },
    {
      id: 'rev-2',
      author: 'Melissa Vance',
      rating: 4,
      comment: 'The new responsive website has really boosted our booking rate. We wanted some custom branding adjustments and the AI generated style guide made it quick.',
      replyText: '',
    },
    {
      id: 'rev-3',
      author: 'Thomas Wright',
      rating: 2,
      comment: 'Initial design took a day longer than expected. The drone shots of our clinic were amazing though.',
      replyText: '',
    },
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [draftingId, setDraftingId] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      comment: newReviewText,
      replyText: '',
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setNewReviewRating(5);
  };

  const handlePublish = (id: string) => {
    setPublishedId(id);
    setTimeout(() => {
      setPublishedId(null);
    }, 4000);
  };

  const handleGenerateReply = async (review: Review) => {
    setDraftingId(review.id);
    try {
      const response = await fetch('/api/gemini/reply-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: review.comment,
          rating: review.rating,
          author: review.author,
        }),
      });
      const data = await response.json();
      
      setReviews(prev => prev.map(r => {
        if (r.id === review.id) {
          return { ...r, replyText: data.reply, repliedAt: new Date().toISOString() };
        }
        return r;
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setDraftingId(null);
    }
  };

  const handleManualReplyChange = (id: string, text: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, replyText: text };
      }
      return r;
    }));
  };

  return (
    <div id="gbp-manager-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Analytics & Checklist Panel */}
      <div className="lg:col-span-4 space-y-6">
        {/* Bento Stats Block */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-300 uppercase tracking-widest">GBP Health Index</h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">Excellent</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-[#06080e] p-4 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-[10px] block font-medium">Profile Score</span>
              <span className="text-2xl font-black text-white mt-1 block">98%</span>
              <span className="text-[10px] text-emerald-400 flex items-center mt-1 font-semibold">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +2.4% vs L30D
              </span>
            </div>
            <div className="bg-[#06080e] p-4 rounded-2xl border border-white/5">
              <span className="text-slate-400 text-[10px] block font-medium">Map Views</span>
              <span className="text-2xl font-black text-white mt-1 block">14.8k</span>
              <span className="text-[10px] text-cyan-400 flex items-center mt-1 font-semibold">
                <BarChart3 className="h-3 w-3 mr-0.5" /> +15% reach
              </span>
            </div>
          </div>

          {/* Quick Mini Graph */}
          <div className="mt-4 p-3 bg-[#06080e] rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                <Trophy className="h-4 w-4 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Local Authority Pack</h4>
                <p className="text-[9px] text-slate-400">Position: #1 in local real estate media</p>
              </div>
            </div>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-bold">SEO Elite</span>
          </div>
        </div>

        {/* Local SEO & MAP CITATION Checklist */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-200">Map Pack Checklist</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { label: 'NAP Consistency verified across 45 directories', done: true },
              { label: 'Google Business Profile synchronized with Drone Media', done: true },
              { label: 'Geo-tagged metadata on corporate photography', done: true },
              { label: 'Map Coordinate Coordinates correctly aligned', done: true },
              { label: 'Automatic review reply triggers enabled', done: false },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2.5">
                <div className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center border ${
                  item.done ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-white/10 text-slate-600'
                }`}>
                  {item.done && <CheckCircle className="h-3 w-3" />}
                </div>
                <span className={`text-[11px] font-medium leading-relaxed ${
                  item.done ? 'text-slate-300' : 'text-slate-500'
                }`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews & AI Auto Reply Column */}
      <div className="lg:col-span-8 glass-card rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-cyan-400" />
              <div>
                <h3 className="font-bold text-sm text-white">GBP Profile Customer Reviews</h3>
                <p className="text-xs text-slate-400">Review replies draft instantly with keyword optimization.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-300 bg-[#06080e] border border-white/5 px-3 py-1.5 rounded-xl">
              Average: <span className="text-amber-400 font-extrabold">★ 4.8</span> (120 reviews)
            </span>
          </div>

          {/* Create Test Review form */}
          <form onSubmit={handleCreateReview} className="mb-6 p-4 rounded-2xl bg-[#06080e] border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Reviewer Name</label>
              <input
                type="text"
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                placeholder="e.g. John Doe"
                required
                className="w-full bg-[#030407] border border-white/10 focus:border-cyan-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div className="md:col-span-5">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Review Comment</label>
              <input
                type="text"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                placeholder="Write review experience..."
                required
                className="w-full bg-[#030407] border border-white/10 focus:border-cyan-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Rating</label>
              <select
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(Number(e.target.value))}
                className="w-full bg-[#030407] border border-white/10 focus:border-cyan-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none cursor-pointer"
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>
            <button
              type="submit"
              className="glossy-btn md:col-span-1 flex items-center justify-center p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer w-full"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Review List */}
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-[#06080e]/60 rounded-2xl border border-white/5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-xs text-white block">{rev.author}</span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-800'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500">Verified Client</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerateReply(rev)}
                    disabled={draftingId === rev.id}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/25 rounded-lg text-[10px] font-bold hover:bg-cyan-500/20 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>{draftingId === rev.id ? 'Drafting...' : 'AI Draft Reply'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 mt-3 italic leading-relaxed">"{rev.comment}"</p>

                {/* Reply section */}
                {rev.replyText && (
                  <div className="mt-4 p-3.5 bg-[#030407]/80 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] uppercase font-bold text-cyan-400 tracking-wider">Owner Reply Draft</span>
                      <span className="text-[8px] text-slate-500">Drafted with Gemini-3.5-flash</span>
                    </div>
                    <textarea
                      value={rev.replyText}
                      onChange={(e) => handleManualReplyChange(rev.id, e.target.value)}
                      className="w-full bg-[#06080e] border border-white/10 focus:border-cyan-500 text-white rounded-lg p-2.5 text-xs focus:outline-none h-16 resize-none font-medium leading-relaxed"
                    />
                    <div className="flex justify-between items-center mt-2.5">
                      {publishedId === rev.id ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
                          <CheckCircle className="h-3 w-3" />
                          <span>Published successfully!</span>
                        </span>
                      ) : (
                        <span></span>
                      )}
                      <button
                        onClick={() => handlePublish(rev.id)}
                        className="glossy-btn flex items-center space-x-1 px-3 py-1.5 bg-emerald-500 text-slate-950 font-extrabold text-[10px] rounded-md hover:bg-emerald-400 transition-all cursor-pointer"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Publish to GBP</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
