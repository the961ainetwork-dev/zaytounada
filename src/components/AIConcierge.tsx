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
      {/* Light-dark backdrop overlay */}
      <div 
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Floating sliding drawer panel */}
      <div className="relative w-full max-w-xl bg-white border-l border-neutral-250 text-neutral-900 h-full flex flex-col shadow-2xl animate-slide-in">
        
        {/* Panel Header */}
        <div className="p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 bg-red-50 border border-red-250 rounded-lg shadow-inner">
              <Bot className="w-5 h-5 text-red-650 animate-pulse" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border border-white flex items-center justify-center">
                <span className="text-[7px] text-white font-bold">✻</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-semibold text-base tracking-widest uppercase text-neutral-900">Gourmet Concierge</h3>
                <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">AI</span>
              </div>
              <p className="text-[10px] font-mono text-neutral-500 tracking-wider">The Zaytouynda Inspection AI Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer rounded-full"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer rounded-full"
              id="ai-concierge-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content lists and chats viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
          
          {/* Saved items tags reminder context */}
          {savedRestaurants.length > 0 && (
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded text-xs space-y-1">
              <span className="text-[8px] font-mono text-red-600 font-bold tracking-widest uppercase block">Personalized Culinary Scope</span>
              <p className="text-neutral-700 font-serif italic text-xs leading-normal font-light">
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
                    <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-red-600" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className={`p-4 rounded text-xs sm:text-[13px] leading-relaxed relative shadow-xs ${
                      isModel 
                        ? 'bg-neutral-50 border border-neutral-200 text-neutral-850 font-serif font-light' 
                        : 'bg-red-650 border border-red-500 text-white font-sans font-light'
                    }`}>
                      {/* Message text with pre-wrap spacing support for formatting splits */}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {/* Time footer timestamp */}
                    <p className="text-[9px] text-neutral-400 font-mono flex items-center gap-1 px-1 justify-end uppercase tracking-wider">
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
                <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 animate-spin">
                  <span className="text-red-600 text-xs font-bold">✻</span>
                </div>
                <div className="py-4.5 px-5 bg-neutral-50 border border-neutral-200 text-xs rounded flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                  </div>
                  <span className="font-serif italic text-neutral-500 font-light">Zaytouynda expert counselor computing fine details...</span>
                </div>
              </div>
            )}

            {/* Error notifications */}
            {errorText && (
              <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-red-905 uppercase tracking-widest font-mono text-[10px]">Concierge Timeout</h5>
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
              <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase block font-bold">Suggested Gourmet Directives</span>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sug)}
                    className="w-full text-left p-3.5 rounded bg-neutral-50 border border-neutral-200 hover:border-red-600 hover:bg-white text-xs text-neutral-600 hover:text-red-700 transition-all cursor-pointer font-light shadow-xs"
                  >
                    ⋄ "{sug}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input box section */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200">
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
              className="flex-1 px-4 py-3 bg-white border border-neutral-250 rounded text-xs sm:text-[13px] text-neutral-900 placeholder-neutral-400 outline-none focus:border-red-650 shadow-sm"
              id="ai-concierge-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`p-3 rounded text-white shadow transition-all cursor-pointer ${
                isLoading || !inputValue.trim()
                  ? 'bg-neutral-100 text-neutral-350 cursor-not-allowed border border-neutral-200/50 shadow-none'
                  : 'bg-red-600 border border-red-650 text-white hover:bg-red-650 active:scale-95'
              }`}
              id="ai-concierge-send-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[8px] text-neutral-450 font-mono text-center mt-3 uppercase tracking-widest">
            Powered by Gemini AI Studio • Zaytouynda Counselor Program.
          </p>
        </div>

      </div>
    </div>
  );
}
