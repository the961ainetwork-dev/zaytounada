import { useState } from 'react';
import { Article } from '../types';
import { ARTICLES } from '../data/restaurants';
import { BookOpen, Calendar, User, ArrowLeft, Clock, Share2, Award, Heart, Scroll } from 'lucide-react';

export default function MagazineView() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = ARTICLES.find(a => a.id === selectedArticleId);

  // If article is selected, render editorial reading format
  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-neutral-900" id="article-detail-view">
        {/* Back navigational option */}
        <button
          onClick={() => setSelectedArticleId(null)}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors mb-8 group cursor-pointer uppercase tracking-widest font-mono"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Magazine Feed</span>
        </button>

        {/* Content Cover Header */}
        <article className="space-y-6">
          <div className="space-y-3.5 text-left">
            <span className="px-3 py-1 bg-red-50 text-red-650 text-[9px] font-bold uppercase tracking-widest rounded font-mono border border-red-200">
              {selectedArticle.category}
            </span>
            <h1 className="font-serif font-light text-3xl sm:text-4xl text-neutral-900 leading-tight uppercase tracking-wide">
              {selectedArticle.title}
            </h1>
            <p className="font-serif italic text-lg text-neutral-600 leading-relaxed font-light">
              {selectedArticle.subtitle}
            </p>
          </div>

          {/* Author metadata and metrics */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-neutral-200 text-[10px] uppercase tracking-wider font-mono text-neutral-500">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-neutral-400" />
              <span>By {selectedArticle.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>{selectedArticle.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>{selectedArticle.readTime}</span>
            </div>
            <div className="ml-auto flex gap-3">
              <button 
                onClick={() => alert('Guide link copied to clipboard!')}
                className="flex items-center gap-1 hover:text-red-600 text-neutral-500 cursor-pointer select-none font-bold"
              >
                <Share2 className="w-3.5 h-3.5 font-bold" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Majestic Hero Cover Image */}
          <div className="h-80 sm:h-[420px] rounded overflow-hidden shadow-md bg-neutral-100 border border-neutral-200">
            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Actual Editorial Copyparagraphs */}
          <div className="font-serif text-neutral-800 text-sm sm:text-base leading-relaxed space-y-6 pt-4 max-w-2xl mx-auto font-light text-left">
            {selectedArticle.content.map((paragraph, i) => (
              <p key={i} className="first-letter:font-serif first-letter:text-3xl first-letter:font-light first-letter:text-red-650 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="pt-8 border-t border-neutral-200 max-w-2xl mx-auto flex items-center justify-center">
            <div className="text-center p-6 bg-neutral-50 rounded border border-neutral-200 w-full shadow-xs">
              <Scroll className="w-8 h-8 text-red-650 mx-auto mb-2.5" />
              <p className="font-serif font-light text-sm text-neutral-900">This concludes the official editorial report.</p>
              <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-1 font-bold">Zaytouynda Guide Editorial, Beirut HQ.</p>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-neutral-900" id="magazine-main-feed">
      {/* Title Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center justify-center md:justify-start gap-2">
          <BookOpen className="w-8 h-8 text-red-650" />
          <span>The Zaytouynda Magazine</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl font-light tracking-wide">
          Taste stories from inside kitchens, historical diaries, chef chronicles, and international culinary reporting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ARTICLES.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticleId(article.id)}
            className="group bg-white border border-neutral-200 rounded overflow-hidden shadow-sm hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            id={`article-card-${article.id}`}
          >
            <div>
              {/* Photo Box */}
              <div className="h-44 w-full overflow-hidden relative border-b border-neutral-200">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-500 opacity-90"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-50 border border-red-200 text-red-650 text-[8px] font-mono uppercase tracking-widest font-bold rounded">
                  {article.category}
                </span>
              </div>

              {/* Text Context Pane */}
              <div className="p-4.5 space-y-2 text-left">
                <span className="text-[9px] font-semibold text-neutral-450 font-mono uppercase tracking-wider">
                  {article.date} • {article.readTime}
                </span>
                <h3 className="font-serif font-light text-base text-neutral-900 group-hover:text-red-650 transition-colors line-clamp-2 uppercase tracking-wide">
                  {article.title}
                </h3>
                <p className="text-neutral-555 text-xs line-clamp-2 italic leading-relaxed font-serif font-light pt-0.5">
                  {article.subtitle}
                </p>
              </div>
            </div>

            {/* Author info footer */}
            <div className="mx-4.5 pb-4.5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
              <span>By {article.author}</span>
              <span className="text-red-650 group-hover:underline font-bold font-serif select-none cursor-pointer">
                Read Article ➔
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
