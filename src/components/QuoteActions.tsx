
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Shuffle, Zap } from "lucide-react";

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
  onRandomFavorite
}) => {
  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 rounded-3xl blur-xl"></div>
      
      <div className="relative grid md:grid-cols-2 gap-6">
        <Button
          onClick={onGenerate}
          disabled={isLoading || !selectedAI || !selectedCategory}
          className={`group relative h-20 text-xl font-bold overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500'
          } text-white shadow-2xl hover:shadow-purple-500/50 transform hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 border-0`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          
          {/* Button content */}
          <div className="relative flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <div className="relative">
                  <Loader2 className="w-7 h-7 animate-spin" />
                  <div className="absolute inset-0 w-7 h-7 animate-ping rounded-full bg-white/30"></div>
                </div>
                <span className="animate-pulse">Generating...</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                  <Zap className="absolute inset-0 w-7 h-7 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
                </div>
                <span className="group-hover:tracking-wide transition-all duration-300">
                  Generate Quote
                </span>
              </>
            )}
          </div>
          
          {/* Particle effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/50 rounded-full animate-ping"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              ></div>
            ))}
          </div>
        </Button>

        <Button
          onClick={onRandomFavorite}
          disabled={favoritesCount === 0}
          variant="outline"
          className={`group relative h-20 text-xl font-bold overflow-hidden ${
            isDarkMode 
              ? 'border-2 border-slate-600 hover:border-purple-400 hover:bg-slate-700/50 text-slate-300 hover:text-white' 
              : 'border-2 border-slate-300 hover:border-purple-400 hover:bg-purple-50 text-slate-700 hover:text-purple-600'
          } transition-all duration-500 hover:scale-[1.02] hover:shadow-xl backdrop-blur-sm disabled:opacity-50`}
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          
          <div className="relative flex items-center justify-center gap-3">
            <div className="relative">
              <Shuffle className="w-7 h-7 group-hover:rotate-180 transition-transform duration-700" />
              <div className="absolute inset-0 w-7 h-7 blur-lg opacity-0 group-hover:opacity-50 bg-purple-400 transition-opacity duration-300"></div>
            </div>
            <span className="group-hover:tracking-wide transition-all duration-300">
              Random Favorite
            </span>
            {favoritesCount > 0 && (
              <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'
              } group-hover:scale-110 transition-transform duration-300`}>
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
