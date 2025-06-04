
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";

interface SavedQuote {
  id: string;
  quote: string;
  author: string;
  category: string;
  timestamp: number;
}

interface FavoritesManagerProps {
  favorites: SavedQuote[];
  isDarkMode: boolean;
  onClearFavorites: () => void;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  favorites,
  isDarkMode,
  onClearFavorites
}) => {
  const exportFavorites = () => {
    if (favorites.length === 0) {
      toast.error("No favorites to export!");
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      totalQuotes: favorites.length,
      quotes: favorites.map(fav => ({
        quote: fav.quote,
        author: fav.author,
        category: fav.category,
        savedAt: new Date(fav.timestamp).toISOString()
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `favorite-quotes-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success("Favorites exported successfully!");
  };

  if (favorites.length === 0) return null;

  return (
    <div className="mt-8">
      <div className={`flex items-center justify-between p-4 rounded-xl ${
        isDarkMode 
          ? 'bg-slate-800/40 border border-slate-700/50' 
          : 'bg-white/60 border border-slate-200/50'
      } backdrop-blur-sm`}>
        <div className="flex items-center gap-3">
          <Heart className={`w-5 h-5 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
          <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
            {favorites.length} Favorite Quote{favorites.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={exportFavorites}
            variant="outline"
            size="sm"
            className={`${
              isDarkMode 
                ? 'border-slate-600 hover:bg-slate-700 text-slate-300 hover:text-white hover:border-green-400' 
                : 'border-slate-300 hover:bg-slate-100 text-slate-700 hover:border-green-400'
            } transition-all duration-300`}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button
            onClick={onClearFavorites}
            variant="outline"
            size="sm"
            className={`${
              isDarkMode 
                ? 'border-slate-600 hover:bg-red-900/20 text-slate-300 hover:text-red-300 hover:border-red-500' 
                : 'border-slate-300 hover:bg-red-50 text-slate-700 hover:text-red-600 hover:border-red-400'
            } transition-all duration-300`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesManager;
