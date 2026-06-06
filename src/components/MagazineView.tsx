import { useState, useEffect } from 'react';
import { Article } from '../types';
import { ARTICLES as staticArticles } from '../data/restaurants';
import { BookOpen, Calendar, User, ArrowLeft, Clock, Share2, Award, Heart, Scroll, Compass, MessageSquare, Quote, Sparkles } from 'lucide-react';

interface MagazineViewProps {
  selectedArticleId?: string | null;
  setSelectedArticleId?: (id: string | null) => void;
}

export default function MagazineView({
  selectedArticleId: propSelectedArticleId,
  setSelectedArticleId: propSetSelectedArticleId
}: MagazineViewProps = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [localSelectedArticleId, setLocalSelectedArticleId] = useState<string | null>(null);

  const selectedArticleId = propSelectedArticleId !== undefined ? propSelectedArticleId : localSelectedArticleId;
  const setSelectedArticleId = propSetSelectedArticleId !== undefined ? propSetSelectedArticleId : setLocalSelectedArticleId;

  useEffect(() => {
    fetch('/api/articles')
      .then(r => {
        if (r.ok) return r.json();
        throw new Error('Fallback');
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        } else {
          setArticles(staticArticles);
        }
      })
      .catch(() => {
        setArticles(staticArticles);
      });
  }, []);

  const currentArticles = articles.length > 0 ? articles : staticArticles;
  const selectedArticle = currentArticles.find(a => a.id === selectedArticleId);

  // If article is selected, render spectacular avant garde editorial reading layout
  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-neutral-900 animate-fade-in" id="article-detail-view">
        {/* Navigation Header */}
        <div className="flex justify-between items-center border-b border-neutral-200 pb-5 mb-10">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="flex items-center gap-2 text-[10px] font-mono font-bold text-neutral-500 hover:text-red-650 transition-colors uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>EXIT DIRECTORY FEED</span>
          </button>
          <div className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase font-bold">
            Zaytouna Chronicle / Official Report
          </div>
        </div>

        {/* Article Container */}
        <article className="space-y-10">
          {/* Asymmetrical Floating Category and Title */}
          <div className="space-y-4 text-left">
            <span className="inline-block px-3 py-1 bg-red-650 text-white text-[9px] font-mono font-black uppercase tracking-widest rounded-sm">
              {selectedArticle.category}
            </span>
            <h1 className="font-serif font-extralight text-3xl sm:text-5xl lg:text-6xl text-neutral-950 leading-none uppercase tracking-tight">
              {selectedArticle.title}
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-neutral-600 leading-relaxed font-light border-l-2 border-red-200 pl-4 py-1">
              {selectedArticle.subtitle}
            </p>
          </div>

          {/* Author metadata and metrics banner */}
          <div className="flex flex-wrap items-center gap-y-4 gap-6 py-5 border-y border-neutral-200 text-[10px] uppercase font-mono text-neutral-500 tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center font-bold font-serif text-neutral-700 text-xs">
                {selectedArticle.author.charAt(0)}
              </div>
              <span>By <strong className="text-neutral-900 font-bold">{selectedArticle.author}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>{selectedArticle.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{selectedArticle.readTime}</span>
            </div>
            <div className="ml-auto">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Editorial link successfully copied!');
                }}
                className="flex items-center gap-1.5 hover:text-red-650 text-neutral-500 transition-colors cursor-pointer font-bold border border-neutral-200 px-3 py-1 rounded bg-neutral-50 hover:bg-neutral-100"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Story</span>
              </button>
            </div>
          </div>

          {/* High impact cover photo layout */}
          <div className="relative h-96 sm:h-[480px] w-full rounded-2xl overflow-hidden shadow-sm bg-neutral-100 border border-neutral-250">
            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/25 to-transparent h-24 pointer-events-none" />
          </div>

          {/* Editorial body column layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
            {/* Left Column (Brutalist Quote/Snippet) */}
            <div className="md:col-span-4 space-y-6 text-left border-r border-neutral-150 pr-6 hidden md:block">
              <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg">
                <Quote className="w-8 h-8 text-red-650 opacity-40 mb-3" />
                <p className="font-serif italic text-xs text-neutral-600 leading-relaxed font-light">
                  "This report represents anonymous, unannounced inspections performed at the highest level of detail. Vetted for purists."
                </p>
                <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold mt-3">
                  — Zaytouna Vetting protocol
                </div>
              </div>
              <div className="text-[10px] font-mono space-y-1.5 text-neutral-500 uppercase tracking-wider">
                <div className="font-bold text-neutral-750">Regional Details:</div>
                <div>📍 Territory: Lebanon</div>
                <div>🌿 Subject: Hospitality & Craft</div>
                <div>🛡️ Status: Vouched Outpost</div>
              </div>
            </div>

            {/* Right Column (Actual paragraphs) */}
            <div className="md:col-span-8 font-serif text-neutral-800 text-base sm:text-lg leading-relaxed space-y-6 text-left font-light pl-1">
              {selectedArticle.content.map((paragraph, i) => {
                if (i === 0) {
                  return (
                    <p key={i} className="first-letter:font-serif first-letter:text-5xl first-letter:font-black first-letter:text-red-650 first-letter:mr-2.5 first-letter:float-left first-letter:leading-none">
                      {paragraph}
                    </p>
                  );
                }
                return (
                  <p key={i} className="font-light">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="pt-10 border-t border-neutral-200 max-w-3xl mx-auto flex items-center justify-center">
            <div className="text-center p-8 bg-neutral-50 border border-neutral-205 rounded-xl w-full shadow-2xs">
              <Scroll className="w-7 h-7 text-red-650 mx-auto mb-3" />
              <p className="font-serif font-light text-sm text-neutral-900">
                You have reached the end of this official report. Stay tuned for periodic bulletins.
              </p>
              <p className="text-[9.5px] text-neutral-500 font-mono uppercase tracking-widest mt-2 font-black">
                ZAYTOUNADA HOSPITALITY RESEARCH GROUP • BEIRUT
              </p>
            </div>
          </div>

          {/* Dynamic Suggested Reads Section (Same category first, then others) */}
          {(() => {
            const sameCategory = currentArticles.filter(
              a => a.id !== selectedArticle.id && a.category === selectedArticle.category
            );
            const diffCategory = currentArticles.filter(
              a => a.id !== selectedArticle.id && a.category !== selectedArticle.category
            );
            const suggested = [...sameCategory, ...diffCategory].slice(0, 3);

            if (suggested.length === 0) return null;

            return (
              <div className="pt-12 border-t border-neutral-200 mt-14 text-left" id="dynamic-suggested-reads-section">
                <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] font-extrabold text-red-650 block mb-1">
                  📰 Hospitality Roundup
                </span>
                <h3 className="font-serif font-light text-xl sm:text-2xl text-neutral-950 uppercase tracking-wide mb-6">
                  Suggested <span className="font-semibold text-red-650">Reads & Chronicles</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {suggested.map((art) => (
                    <div 
                      key={art.id}
                      onClick={() => {
                        setSelectedArticleId(art.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group cursor-pointer bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl p-4.5 flex flex-col justify-between transition-all hover:shadow-2xs text-left"
                    >
                      <div className="space-y-3">
                        <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-200 relative bg-neutral-150">
                          <img 
                            src={art.imageUrl} 
                            alt={art.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-101 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 left-2 bg-neutral-900 text-white font-mono text-[7px] tracking-widest font-black uppercase px-2 py-0.5 rounded shadow">
                            {art.category}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-neutral-450 uppercase tracking-widest block">
                            {art.date} • {art.readTime}
                          </span>
                          <h4 className="font-serif font-bold text-xs text-neutral-900 group-hover:text-red-650 transition-colors line-clamp-2 leading-snug uppercase tracking-wide">
                            {art.title}
                          </h4>
                          <p className="text-[10px] text-neutral-500 italic font-serif font-light line-clamp-2 leading-relaxed">
                            {art.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-neutral-100 pt-3 mt-4 text-[8.5px] font-mono text-neutral-450 group-hover:text-red-650 transition-colors font-bold uppercase tracking-wider flex justify-between items-center">
                        <span className="truncate max-w-[80px]">By {art.author.split(' ')[0]}</span>
                        <span className="text-red-650">Read report ➔</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </article>
      </div>
    );
  }

  // Avant Garde overview list layout
  // 1. Separation of first article as spectacular offset cover
  const featuredArticle = currentArticles[0];
  const secondaryArticles = currentArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-neutral-900 text-left animate-fade-in" id="magazine-main-feed">
      {/* Avant Garde Massive Title Header Banner */}
      <div className="border-b-4 border-neutral-950 pb-8 mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4">
        <div>
          <span className="text-xs font-mono font-black tracking-[0.3em] uppercase text-red-650 block">
            THE CHRONICLES OF LEBANESE CULINARY HONORS
          </span>
          <h1 className="font-serif font-extralight text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none uppercase mt-2 text-neutral-950">
            ZAYTOUNA <span className="font-extrabold text-red-650 font-serif">MAGAZINE</span>
          </h1>
        </div>
        <div className="font-mono text-[10px] uppercase font-bold text-neutral-550 border-t border-neutral-300 pt-3 md:pt-0 md:border-t-0 space-y-1">
          <div>VOLUME IV / ISSUE 02</div>
          <div>DATE: JUNE 2026</div>
          <div className="text-red-650">● NEWS & ENTERPRISE INSIGHTS</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column (Main features) - Occupies 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* FEATURED COVER STORY: BRUTALIST GRID */}
          {featuredArticle && (
            <div 
              onClick={() => setSelectedArticleId(featuredArticle.id)}
              className="group cursor-pointer border border-neutral-250 rounded-2xl overflow-hidden hover:border-neutral-400 bg-white shadow-2xs hover:shadow-sm transition-all text-left"
            >
              <div className="relative h-80 sm:h-[420px] bg-neutral-100 overflow-hidden">
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-101 transition-all duration-705"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-5 left-5 px-3 py-1 bg-neutral-950 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-sm">
                  ★ FEATURED INTEL
                </span>
              </div>
              
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-neutral-450 uppercase tracking-wider">
                  <span>{featuredArticle.date}</span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                  <span>•</span>
                  <span>By {featuredArticle.author}</span>
                </div>
                
                <h2 className="font-serif font-light text-2xl sm:text-4xl text-neutral-950 group-hover:text-red-650 transition-colors leading-tight uppercase tracking-wide">
                  {featuredArticle.title}
                </h2>
                
                <p className="text-neutral-555 text-sm font-serif italic font-light leading-relaxed">
                  {featuredArticle.subtitle}
                </p>

                <div className="border-t border-neutral-150 pt-4 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-red-650 font-bold">
                  <span>Category: {featuredArticle.category}</span>
                  <span>Read Full Chronicle Report ➔</span>
                </div>
              </div>
            </div>
          )}

          {/* SECONDARY STORIES: ASYMMETRIC GRID */}
          <div className="border-t border-neutral-250 pt-10">
            <h3 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-neutral-500 mb-6">
              LATEST HOSP-ENTERPRISE LOGS
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {secondaryArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className="group bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl overflow-hidden p-4.5 transition-all text-left flex flex-col justify-between hover:shadow-3xs"
                  id={`article-card-${art.id}`}
                >
                  <div className="space-y-4">
                    <div className="h-44 w-full rounded-lg overflow-hidden relative border border-neutral-200">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-50 text-red-650 font-mono text-[8px] font-black uppercase tracking-widest rounded border border-red-200">
                        {art.category}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono text-neutral-450 uppercase tracking-widest block font-bold">
                        {art.date} • {art.readTime}
                      </span>
                      <h4 className="font-serif font-semibold text-sm text-neutral-900 group-hover:text-red-650 transition-colors line-clamp-2 uppercase tracking-wide">
                        {art.title}
                      </h4>
                      <p className="text-neutral-555 text-xs font-serif italic font-light line-clamp-2 leading-relaxed">
                        {art.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 pt-3.5 mt-4 flex items-center justify-between text-[10px] font-mono uppercase text-red-650 font-bold">
                    <span>By {art.author}</span>
                    <span>Read Report ➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Avant Garde Sidebar - Industry intelligence feed) - Occupies 4 columns */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Avant Garde Statement Block */}
          <div className="bg-neutral-950 text-white rounded-2xl p-6 relative overflow-hidden text-left border border-neutral-850">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/15 rounded-full blur-2xl pointer-events-none" />
            <Sparkles className="w-8 h-8 text-amber-300 mb-4" />
            <h4 className="font-serif font-light text-xl text-white uppercase tracking-wider leading-snug">
              "TERROIR VETTED, PRIVILEGES GRANTED."
            </h4>
            <p className="text-[11px] text-neutral-300 font-light mt-3 leading-relaxed">
              Zaytounada sits at the junction of elite culinary journalism and discrete regional evaluation. Our reviewers do not notify, accept freebies, or compromise status.
            </p>
            <div className="border-t border-neutral-800 pt-4 mt-5 text-[9px] font-mono uppercase text-amber-300 tracking-widest">
              Issue No. IV — Beirut HQ
            </div>
          </div>

          {/* Lebanese Hospitality Intel Bulletins (Interactive feed) */}
          <div className="border border-neutral-200 bg-white rounded-2xl p-5 text-left space-y-5">
            <div className="border-b border-neutral-150 pb-3 flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-neutral-900">
                ⚡ LIVE INDUSTRY LOGS
              </span>
              <span className="text-[8px] bg-red-100 text-red-650 font-mono font-bold px-2 py-0.5 rounded animate-pulse">
                LIVE
              </span>
            </div>

            <div className="space-y-4 divide-y divide-neutral-100">
              
              <div className="pt-3 first:pt-0 space-y-1.5">
                <span className="text-[8px] font-mono text-amber-600 font-bold uppercase tracking-widest">
                  BEKAA VALLEY / OLIVE HARVEST
                </span>
                <h5 className="font-serif text-xs font-semibold uppercase tracking-wide text-neutral-905">
                  Organic Cold-Press Projections Look Masterful
                </h5>
                <p className="text-[10px] text-neutral-500 leading-relaxed font-light">
                  Inspection teams report premium quality levels across organic mills in Khenchara. Olive yields score high.
                </p>
                <div className="text-[8px] font-mono text-neutral-400">June 5, 2026 • 2 min read</div>
              </div>

              <div className="pt-3 space-y-1.5">
                <span className="text-[8px] font-mono text-emerald-600 font-bold uppercase tracking-widest font-bold">
                  BATROUN COASTAL / SEAFOOD TREND
                </span>
                <h5 className="font-serif text-xs font-semibold uppercase tracking-wide text-neutral-905">
                  Raw Catch SAYYADIEH Secures Spotlights
                </h5>
                <p className="text-[10px] text-neutral-500 leading-relaxed font-light font-light">
                  Unconventional maritime techniques by young native chefs are changing classical beachhouse menus this summer.
                </p>
                <div className="text-[8px] font-mono text-neutral-400">June 3, 2026 • 1 min read</div>
              </div>

              <div className="pt-3 space-y-1.5">
                <span className="text-[8px] font-mono text-blue-600 font-bold uppercase tracking-widest font-bold">
                  BEIRUT BISTROS / APERITIF CULTURE
                </span>
                <h5 className="font-serif text-xs font-semibold uppercase tracking-wide text-neutral-905">
                  Artisanal ARAK Cocktails Gain Prestige
                </h5>
                <p className="text-[10px] text-neutral-500 leading-relaxed font-light font-light">
                  Arak has transitioned into contemporary mixology spheres, paired with local herbs and Batroun lemon infusions.
                </p>
                <div className="text-[8px] font-mono text-neutral-400">May 31, 2026 • 3 min read</div>
              </div>

            </div>
          </div>

          {/* Quick Newsletter Box */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-left space-y-3">
            <h5 className="font-serif text-sm font-semibold uppercase tracking-wide text-neutral-950">
              Receive Gastronomic Bulletins
            </h5>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              Accept weekly curated chef interviews, recipes, and stars alert logs directly.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const mail = (e.target as any).elements.subscriber_email.value;
              if (mail) {
                fetch('/api/subscribers', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: mail })
                })
                .then(r => {
                  if (r.ok) {
                    alert('Check subscription activated! Welcome onboard.');
                    (e.target as any).reset();
                  } else {
                    return r.json().then(d => { throw new Error(d.error) });
                  }
                })
                .catch(err => alert(err.message || 'Subscription failed. Try again.'));
              }
            }} className="space-y-2">
              <input
                type="email"
                name="subscriber_email"
                required
                placeholder="Submit your email address..."
                className="w-full px-3 py-2 text-xs border border-neutral-250 bg-white rounded focus:outline-none focus:border-red-650"
              />
              <button
                type="submit"
                className="w-full py-2 bg-neutral-950 hover:bg-neutral-900 text-white font-mono font-bold text-[10px] uppercase tracking-widest rounded transition-colors cursor-pointer"
              >
                SUBSCRIBE CHRONICLE
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
