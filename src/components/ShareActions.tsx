import React from 'react';
import { Printer, MessageSquare } from 'lucide-react';

interface ShareActionsProps {
  headline: string;
  excerpt: string;
  linkUrl?: string;
  className?: string;
}

export default function ShareActions({
  headline,
  excerpt,
  linkUrl = 'https://zaytounada.xyz/',
  className = ''
}: ShareActionsProps) {
  
  // Format the excerpt to exactly or maximum 3 lines/sentences
  const cleanExcerpt = React.useMemo(() => {
    if (!excerpt) return '';
    // Let's split by sentences or limit characters/lines to keep it neat
    const lines = excerpt.split('\n').filter(Boolean);
    if (lines.length >= 3) {
      return lines.slice(0, 3).join('\n');
    }
    const sentences = excerpt.match(/[^.!?]+[.!?]+/g) || [excerpt];
    if (sentences.length >= 3) {
      return sentences.slice(0, 3).map(s => s.trim()).join(' ');
    }
    return excerpt;
  }, [excerpt]);

  const handlePdfPrint = () => {
    window.print();
  };

  const handleWhatsAppRedirect = () => {
    const text = `this is a market alert/update from your gide to Lebanon hosptiality and food and uodat es in the restaurants oubs and caffees\n\n${headline}\n-- ${cleanExcerpt}\n\n${linkUrl}\n\nJoin zaytounada to receive ofers  check our website and clkaim latest offers join our wahstapp group https://chat.whatsapp.com/KpV2Ecmc7IM8CVBjICddDChttps://zaytounada.xyz/`;
    const encoded = encodeURIComponent(text);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex flex-wrap items-center gap-2.5 print:hidden ${className}`} id={`share-actions-${headline.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}>
      {/* Pro PDF Print Button */}
      <button
        onClick={handlePdfPrint}
        className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white hover:text-amber-350 border border-neutral-800 text-[11px] font-mono uppercase font-extrabold tracking-wider rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
        title="Print this section to PDF"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Pro PDF Print</span>
      </button>

      {/* WhatsApp Message Redirect Button */}
      <button
        onClick={handleWhatsAppRedirect}
        className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-mono uppercase font-extrabold tracking-wider rounded-lg transition-all shadow-xs cursor-pointer active:scale-95 border border-emerald-700"
        title="Share dynamic market alert on WhatsApp"
      >
        <MessageSquare className="w-3.5 h-3.5 fill-current" />
        <span>WhatsApp Alert</span>
      </button>
    </div>
  );
}
