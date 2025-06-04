import { Button } from '@/components/ui/button';
import { Loader2, Shuffle, Sparkles, Zap } from 'lucide-react';
import React from 'react';

interface QuoteActionsProps {
  isLoading: boolean;
  selectedAI: string;
  selectedCategory: string;
  favoritesCount: number;
  isDarkMode: boolean;
  onGenerate: () => void;
  onRandomFavorite: () => void;
}

const QuoteActions: React.FC<QuoteActionsProps> = ({
  isLoading,
  selectedAI,
  selectedCategory,
  favoritesCount,
  isDarkMode,
  onGenerate,
  onRandomFavorite,
}) => {
  return (
    <div className="relative w-full max-w-screen-md mx-auto px-4 sm:px-6 md:px-8">
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Generate Quote Button */}
        <Button
          onClick={onGenerate}
          disabled={isLoading || !selectedAI || !selectedCategory}
          className={`group relative h-16 sm:h-20 text-lg sm:text-xl font-bold overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500'
          } text-white shadow-md hover:shadow-purple-500/50 transform hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="relative flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin" />
                <span className="animate-pulse">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 sm:w-7 h-6 sm:h-7 group-hover:rotate-12 transition-transform duration-300" />
                <Zap className="absolute inset-0 w-6 sm:w-7 h-6 sm:h-7 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
                <span className="group-hover:tracking-wide transition-all duration-300">
                  Generate Quote
                </span>
              </>
            )}
          </div>
        </Button>

        {/* Random Favorite Button */}
        <Button
          onClick={onRandomFavorite}
          disabled={favoritesCount === 0}
          variant="outline"
          className={`group relative h-16 sm:h-20 text-lg sm:text-xl font-bold overflow-hidden ${
            isDarkMode
              ? 'border border-slate-600 hover:border-purple-400 hover:bg-slate-700/50 text-slate-300 hover:text-white'
              : 'border border-slate-300 hover:border-purple-400 hover:bg-purple-50 text-slate-700 hover:text-purple-600'
          } transition-all duration-500 hover:scale-[1.02] hover:shadow-md backdrop-blur-sm disabled:opacity-50`}
        >
          <div className="relative flex items-center justify-center gap-3">
            <Shuffle className="w-6 sm:w-7 h-6 sm:h-7 group-hover:rotate-180 transition-transform duration-700" />
            <span className="group-hover:tracking-wide transition-all duration-300">
              Random Favorite
            </span>
            {favoritesCount > 0 && (
              <div
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'
                } group-hover:scale-110 transition-transform duration-300`}
              >
                {favoritesCount}
              </div>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuoteActions;
