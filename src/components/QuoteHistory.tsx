import React from 'react';
import { History, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedQuote {
  id: string;
  quote: string;
  author: string;
  category: string;
  timestamp: number;
}

interface QuoteHistoryProps {
  quoteHistory: SavedQuote[];
  isDarkMode: boolean;
  onLoadHistoryQuote: (quote: SavedQuote) => void;
  onClearHistory: () => void;
}

const QuoteHistory: React.FC<QuoteHistoryProps> = ({
  quoteHistory,
  isDarkMode,
  onLoadHistoryQuote,
  onClearHistory
}) => {
  if (quoteHistory.length === 0) return null;

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="mt-12 relative">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent rounded-2xl"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            isDarkMode ? 'text-slate-200' : 'text-slate-700'
          } flex items-center gap-3`}>
            <div className="relative">
              <History className="w-6 h-6" />
              <div className="absolute inset-0 w-6 h-6 blur-lg opacity-40 bg-purple-400 animate-pulse"></div>
            </div>
            Recent Quotes
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'
            }`}>
              {quoteHistory.length}
            </div>
          </h3>

          <Button
            onClick={onClearHistory}
            variant="outline"
            size="sm"
            className={`${
              isDarkMode 
                ? 'border-slate-600 hover:bg-red-900/20 text-slate-300 hover:text-red-300 hover:border-red-500' 
                : 'border-slate-300 hover:bg-red-50 text-slate-700 hover:text-red-600 hover:border-red-400'
            } transition-all duration-300`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
        
        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
          {quoteHistory.slice(0, 5).map((historyQuote, index) => (
            <button
              key={historyQuote.id}
              onClick={() => onLoadHistoryQuote(historyQuote)}
              className={`group w-full text-left p-4 rounded-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-slate-800/40 to-slate-700/40 hover:from-slate-700/60 hover:to-slate-600/60 text-slate-300 border border-slate-600/30 hover:border-slate-500/50' 
                  : 'bg-gradient-to-r from-white/60 to-blue-50/60 hover:from-white/90 hover:to-blue-50/90 text-slate-700 border border-slate-200/50 hover:border-slate-300/70'
              } transition-all duration-300 hover:scale-[1.02] hover:shadow-xl backdrop-blur-sm`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium mb-1 group-hover:text-purple-400 transition-colors duration-200">
                    "{historyQuote.quote.substring(0, 80)}..."
                  </div>
                  <div className={`text-xs flex items-center gap-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>— {historyQuote.author}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'
                    }`}>
                      {historyQuote.category}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                } group-hover:text-purple-400 transition-colors duration-200`}>
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(historyQuote.timestamp)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteHistory;
