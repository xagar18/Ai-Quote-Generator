import { Button } from '@/components/ui/button';
import { Clock, History, Trash2 } from 'lucide-react';
import React from 'react';

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
  onClearHistory,
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
    <div className="mt-8 w-full max-w-screen-md mx-auto px-4 sm:px-6 md:px-8">
      <div
        className={`flex flex-col sm:flex-row items-center justify-between mb-6 p-4 sm:p-6 rounded-xl ${
          isDarkMode
            ? 'bg-slate-800/40 border border-slate-700/50'
            : 'bg-white/60 border border-slate-200/50'
        } backdrop-blur-sm`}
      >
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-purple-500" />
          <h3
            className={`text-lg sm:text-xl font-bold ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            Recent Quotes ({quoteHistory.length})
          </h3>
        </div>

        {/* Clear History Button */}
        <Button
          onClick={onClearHistory}
          variant="outline"
          size="sm"
          className={`transition-all duration-300 ${
            isDarkMode
              ? 'border-slate-600 hover:bg-red-900/20 text-slate-300 hover:text-red-300 hover:border-red-500'
              : 'border-slate-300 hover:bg-red-50 text-slate-700 hover:text-red-600 hover:border-red-400'
          }`}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Quote History List */}
      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
        {quoteHistory.map((historyQuote, index) => (
          <button
            key={historyQuote.id}
            onClick={() => onLoadHistoryQuote(historyQuote)}
            className={`group w-full text-left p-4 rounded-xl flex flex-col sm:flex-row justify-between ${
              isDarkMode
                ? 'bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 border border-slate-600/30 hover:border-slate-500/50'
                : 'bg-white/60 hover:bg-blue-50/90 text-slate-700 border border-slate-200/50 hover:border-slate-300/70'
            } transition-all duration-300 hover:scale-[1.02] hover:shadow-md backdrop-blur-sm`}
          >
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm sm:text-base font-medium mb-1 group-hover:text-purple-400">
                "{historyQuote.quote.substring(0, 80)}..."
              </div>
              <div
                className={`text-xs flex items-center gap-2 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <span>— {historyQuote.author}</span>
                <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200/50'
                  }`}
                >
                  {historyQuote.category}
                </span>
              </div>
            </div>
            <div
              className={`text-xs flex items-center gap-1 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              } group-hover:text-purple-400`}
            >
              <Clock className="w-3 h-3" />
              {formatTimeAgo(historyQuote.timestamp)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuoteHistory;
