
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuoteControlsProps {
  selectedAI: string;
  selectedCategory: string;
  isDarkMode: boolean;
  onAIChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const QuoteControls: React.FC<QuoteControlsProps> = ({
  selectedAI,
  selectedCategory,
  isDarkMode,
  onAIChange,
  onCategoryChange
}) => {
  const aiProviders = [
    { value: "gemini", label: "Google Gemini" },
    { value: "deepseek", label: "DeepSeek AI" },
  ];

  const quoteCategories = [
    { value: "motivation", label: "Motivation & Success" },
    { value: "wisdom", label: "Wisdom & Philosophy" },
    { value: "love", label: "Love & Relationships" },
    { value: "leadership", label: "Leadership & Growth" },
    { value: "inspiration", label: "Daily Inspiration" },
    { value: "life", label: "Life & Happiness" },
    { value: "creativity", label: "Creativity & Innovation" },
    { value: "courage", label: "Courage & Strength" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <label className={`text-lg font-semibold ${
          isDarkMode ? 'text-slate-200' : 'text-slate-700'
        } flex items-center gap-3`}>
          <div className={`w-3 h-3 rounded-full ${
            isDarkMode ? 'bg-purple-400' : 'bg-indigo-500'
          } animate-pulse`}></div>
          AI Provider
        </label>
        <Select value={selectedAI} onValueChange={onAIChange}>
          <SelectTrigger className={`h-14 text-lg ${
            isDarkMode 
              ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700' 
              : 'bg-white/80 border-slate-300 text-slate-900 hover:bg-white'
          } transition-all duration-300 focus:ring-2 ${
            isDarkMode ? 'focus:ring-purple-500' : 'focus:ring-indigo-500'
          } backdrop-blur-sm`}>
            <SelectValue placeholder="Choose AI provider" />
          </SelectTrigger>
          <SelectContent className={`${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 backdrop-blur-xl' 
              : 'bg-white border-slate-300 backdrop-blur-xl'
          }`}>
            {aiProviders.map((provider) => (
              <SelectItem 
                key={provider.value} 
                value={provider.value}
                className={`text-lg py-3 ${
                  isDarkMode 
                    ? 'text-white hover:bg-slate-700 focus:bg-slate-700' 
                    : 'text-slate-900 hover:bg-slate-100 focus:bg-slate-100'
                } transition-colors cursor-pointer`}
              >
                {provider.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <label className={`text-lg font-semibold ${
          isDarkMode ? 'text-slate-200' : 'text-slate-700'
        } flex items-center gap-3`}>
          <div className={`w-3 h-3 rounded-full ${
            isDarkMode ? 'bg-pink-400' : 'bg-purple-500'
          } animate-pulse`}></div>
          Quote Category
        </label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className={`h-14 text-lg ${
            isDarkMode 
              ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700' 
              : 'bg-white/80 border-slate-300 text-slate-900 hover:bg-white'
          } transition-all duration-300 focus:ring-2 ${
            isDarkMode ? 'focus:ring-pink-500' : 'focus:ring-purple-500'
          } backdrop-blur-sm`}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className={`${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 backdrop-blur-xl' 
              : 'bg-white border-slate-300 backdrop-blur-xl'
          }`}>
            {quoteCategories.map((category) => (
              <SelectItem 
                key={category.value} 
                value={category.value}
                className={`text-lg py-3 ${
                  isDarkMode 
                    ? 'text-white hover:bg-slate-700 focus:bg-slate-700' 
                    : 'text-slate-900 hover:bg-slate-100 focus:bg-slate-100'
                } transition-colors cursor-pointer`}
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default QuoteControls;
