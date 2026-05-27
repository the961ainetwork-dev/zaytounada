import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { X, Sparkles, Send, RefreshCw, Award, Bot, Clock, AlertCircle } from 'lucide-react';

interface AIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  savedRestaurants: { id: string; name: string; city: string; cuisine: string; stars: number }[];
}

export default function AIConcierge({
  isOpen,
  onClose,
  savedRestaurants
}: AIConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Welcome to the Zaytouynda Guide AI Concierge. I am your discrete culinary counselor. How may I refine your gourmet plans today? I can suggest custom itineraries, explain Zaytouynda Stars (✻), match wine pairings, or recommend elite local restaurants in Lebanon.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const suggestions = [
    "Explain the difference between 1, 2, and 3 Zaytouynda Stars (✻).",
    "Draft a 2-day premium mezza and seaside dining itinerary in Beirut.",
    "Recommend traditional coastal culinary highlights in Lebanon.",
    "Tell me about the famous traditional lamb and seafood dishes in Lebanon."
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setErrorText(null);

    try {
      // Fetch response from server-side proxy
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          savedContext: savedRestaurants
        })
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with our culinary model. Please check your network connection.');
      }

      const data = await response.json();
      
      const modelMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: data.reply || "I apologize, my gourmet channels appear transiently occluded. Please ask again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'An unexpected server error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: "Reset complete. I am at your disposal for pristine gastronomic suggestions.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorText(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden" id="ai-concierge-panel">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Floating sliding drawer panel */}
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border-l border-white/5 text-white h-full flex flex-col shadow-2xl animate-slide-in">
        
        {/* Panel Header */}
        <div className="p-5 border-b border-white/5 bg-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 bg-white/5 border border-white/10 rounded-lg shadow-inner">
              <Bot className="w-5 h-5 text-red-500 animate-pulse" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border border-[#050505] flex items-center justify-center">
                <span className="text-[7px] text-white font-bold">✻</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-light text-base tracking-widest uppercase text-white">Gourmet Concierge</h3>
                <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">AI</span>
              </div>
              <p className="text-[10px] font-mono text-white/40 tracking-wider">The Zaytouynda Inspection AI Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 hover:bg-white/5 text-[#777] hover:text-[#F5F5F5] transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 text-[#777] hover:text-[#F5F5F5] transition-colors cursor-pointer"
              id="ai-concierge-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content lists and chats viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0a0a0a]">
          
          {/* Saved items tags reminder context */}
          {savedRestaurants.length > 0 && (
            <div className="p-3.5 bg-white/5 border border-white/5 rounded text-xs space-y-1">
              <span className="text-[8px] font-mono text-red-500 font-bold tracking-widest uppercase block">Personalized Culinary Scope</span>
              <p className="text-white/70 font-serif italic text-xs leading-normal font-light">
                I am aware of your {savedRestaurants.length} saved restaurant{savedRestaurants.length > 1 ? 's' : ''} ({savedRestaurants.slice(0, 3).map(r => r.name).join(', ')}{savedRestaurants.length > 3 ? '...' : ''}). I can tailor itineraries matching these selections!
              </p>
            </div>
          )}

          {/* Active dialogue logs */}
          <div className="space-y-4">
            {messages.map((msg) => {
              const isModel = msg.role === 'model';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isModel ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
                >
                  {isModel && (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-red-500" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className={`p-4 rounded text-xs sm:text-[13px] leading-relaxed relative ${
                      isModel 
                        ? 'bg-white/5 border border-white/5 text-white/90 font-serif font-light' 
                        : 'bg-red-600 border border-red-500 text-white font-sans font-light'
                    }`}>
                      {/* Message text with pre-wrap spacing support for formatting splits */}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {/* Time footer timestamp */}
                    <p className="text-[9px] text-white/30 font-mono flex items-center gap-1 px-1 justify-end uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      <span>{msg.timestamp}</span>
                    </p>
                   </div>
                </div>
              );
            })}

            {/* Simulated interactive loading spinner */}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] mr-auto text-left">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 animate-spin">
                  <span className="text-red-500 text-xs">✻</span>
                </div>
                <div className="py-4.5 px-5 bg-white/5 border border-white/5 text-xs rounded flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                  </div>
                  <span className="font-serif italic text-white/40 font-light">Zaytouynda expert counselor computing fine details...</span>
                </div>
              </div>
            )}

            {/* Error notifications */}
            {errorText && (
              <div className="p-4 bg-red-950/20 border border-red-900/40 rounded text-xs text-red-400 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-white/90 uppercase tracking-widest font-mono text-[10px]">Concierge Timeout</h5>
                  <p className="mt-0.5 leading-relaxed font-light">{errorText}</p>
                </div>
              </div>
            )}

            {/* Bottom scroll marker */}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Prompt card triggers (shown initially or during chat limits) */}
          {messages.length === 1 && (
            <div className="pt-4 space-y-2.5">
              <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase block font-bold">Suggested Gourmet Directives</span>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="w-full text-left p-3.5 rounded bg-[#050505] border border-white/5 hover:border-red-600 hover:bg-white/5 text-xs text-white/70 hover:text-white transition-all cursor-pointer font-light"
                  >
                    ⋄ "{sug}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input box section */}
        <div className="p-4 bg-[#050505] border-t border-white/5">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask for custom fine dining itineraries..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded text-xs sm:text-[13px] text-white placeholder-white/30 outline-none focus:border-red-600"
              id="ai-concierge-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`p-3 rounded text-white shadow transition-all cursor-pointer ${
                isLoading || !inputValue.trim()
                  ? 'bg-white/5 text-[#777] cursor-not-allowed border border-white/5'
                  : 'bg-transparent border border-red-600 text-red-500 hover:bg-red-600 hover:text-white_active:scale-95'
              }`}
              id="ai-concierge-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[8px] text-white/30 font-mono text-center mt-3 uppercase tracking-widest">
            Powered by Gemini AI Studio • Zaytouynda Counselor Program.
          </p>
        </div>

      </div>
    </div>
  );
}
