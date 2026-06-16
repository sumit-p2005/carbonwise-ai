import { useState, useEffect, useRef } from 'react';
import { useCarbon } from '../context/CarbonContext';
import { Send, Sparkles, MessageSquare, Bot } from 'lucide-react';
import Card from '../components/ui/Card';

const Chat = () => {
  const { chatMessages, sendChatMessage } = useCarbon();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async (textToSend) => {
    const msg = textToSend || input;
    if (!msg.trim()) return;

    setSending(true);
    setInput('');
    await sendChatMessage(msg.trim());
    setSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const sampleQuestions = [
    'How do I reduce my transportation footprint?',
    'What are vampire energy appliances?',
    'Explain the carbon difference in diets',
    'How do I compost kitchen waste?',
    'What is my current carbon score analysis?'
  ];

  // Render markdown-like text in a basic format for simplicity and performance
  const renderMessageText = (text) => {
    // Simple bold markdown parsing (**bold**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full h-[85vh] flex flex-col lg:flex-row gap-6">
      
      {/* Sidebar - Coach Profile & Quick Prompts */}
      <Card hoverEffect={false} className="w-full lg:w-80 shrink-0 border border-slate-100 dark:border-slate-800 flex flex-col justify-between text-left p-6 h-fit lg:h-full">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Bot size={24} className="animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-950 dark:text-white font-outfit">EcoBuddy</h3>
              <span className="text-[10px] text-primary font-bold flex items-center gap-1">
                <Sparkles size={10} /> AI Sustainability Coach
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Coaching Topics
            </h4>
            <ul className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex flex-col gap-2">
              <li className="flex items-center gap-1.5">⚡ Saving Electricity</li>
              <li className="flex items-center gap-1.5">🚗 Carpooling & Transit</li>
              <li className="flex items-center gap-1.5">🍏 Low Carbon Nutrition</li>
              <li className="flex items-center gap-1.5">♻️ Compost & Waste reduction</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Quick Suggestions
            </h4>
            <div className="flex flex-col gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={sending}
                  className="text-left text-xs p-2.5 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-300 hover:border-primary dark:hover:border-primary hover:bg-emerald-500/[0.02] transition font-medium leading-normal disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 leading-normal hidden lg:block">
          EcoBuddy leverages your actual calculator logs (if available) to tailor savings metrics specifically to you.
        </div>
      </Card>

      {/* Main Conversational Assistant Screen */}
      <Card hoverEffect={false} className="flex-grow border border-slate-100 dark:border-slate-800 p-0 flex flex-col overflow-hidden h-full">
        {/* Messages Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {chatMessages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto text-left' : 'ml-auto flex-row-reverse text-right'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isBot ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {isBot ? <Bot size={16} /> : <MessageSquare size={16} />}
                </div>

                {/* Bubble */}
                <div className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                  isBot
                    ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/20'
                    : 'bg-primary text-white rounded-tr-none shadow-md shadow-emerald-500/10'
                }`}>
                  <div className="whitespace-pre-line">
                    {renderMessageText(msg.text)}
                  </div>
                  <span className="block text-[8px] text-slate-400 mt-1.5 opacity-60">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          
          {sending && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-400 rounded-tl-none border border-slate-200/20 text-xs flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          <div ref={scrollRef} />
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/10">
          <div className="flex gap-2 relative items-center">
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask EcoBuddy about sustainable practices or carbon logs..."
              disabled={sending}
              className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-xs focus:border-primary focus:ring-primary/20 focus:ring-4 focus:outline-none resize-none transition"
            />
            
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || sending}
              className="absolute right-2 p-2 bg-primary hover:bg-primary-dark text-white rounded-lg disabled:opacity-40 transition shadow-md shadow-emerald-500/25"
              aria-label="Send Message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

      </Card>
    </div>
  );
};

export default Chat;
