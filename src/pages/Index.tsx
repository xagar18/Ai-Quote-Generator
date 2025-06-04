import FavoritesManager from '@/components/FavoritesManager';
import QuoteActions from '@/components/QuoteActions';
import QuoteControls from '@/components/QuoteControls';
import QuoteDisplay from '@/components/QuoteDisplay';
import QuoteHistory from '@/components/QuoteHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Quote, Sparkles, Star, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SavedQuote {
  id: string;
  quote: string;
  author: string;
  category: string;
  timestamp: number;
}

const Index = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [favorites, setFavorites] = useState<SavedQuote[]>([]);
  const [quoteHistory, setQuoteHistory] = useState<SavedQuote[]>([]);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const OPENROUTER_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedFavorites = localStorage.getItem('favoriteQuotes');
    const savedHistory = localStorage.getItem('quoteHistory');

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    if (savedHistory) {
      setQuoteHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('quoteHistory', JSON.stringify(quoteHistory));
  }, [quoteHistory]);

  const aiProviders = [
    { value: 'gemini', label: 'Google Gemini' },
    { value: 'deepseek', label: 'DeepSeek AI' },
  ];

  const quoteCategories = [
    { value: 'motivation', label: 'Motivation & Success' },
    { value: 'wisdom', label: 'Wisdom & Philosophy' },
    { value: 'love', label: 'Love & Relationships' },
    { value: 'leadership', label: 'Leadership & Growth' },
    { value: 'inspiration', label: 'Daily Inspiration' },
    { value: 'life', label: 'Life & Happiness' },
    { value: 'creativity', label: 'Creativity & Innovation' },
    { value: 'courage', label: 'Courage & Strength' },
  ];

  const generateQuote = async () => {
    if (!selectedAI) {
      toast.error('Please select an AI provider');
      return;
    }

    if (!selectedCategory) {
      toast.error('Please select a quote category');
      return;
    }

    setIsLoading(true);

    try {
      let response;
      let success = false;
      const quoteCategories = [
        { value: 'motivation', label: 'Motivation & Success' },
        { value: 'wisdom', label: 'Wisdom & Philosophy' },
        { value: 'love', label: 'Love & Relationships' },
        { value: 'leadership', label: 'Leadership & Growth' },
        { value: 'inspiration', label: 'Daily Inspiration' },
        { value: 'life', label: 'Life & Happiness' },
        { value: 'creativity', label: 'Creativity & Innovation' },
        { value: 'courage', label: 'Courage & Strength' },
      ];
      const selectedCategoryData = quoteCategories.find((cat) => cat.value === selectedCategory);
      const prompt = `Generate an inspiring and meaningful quote about ${selectedCategoryData?.label}. Return only the quote text and author in this format: "Quote text" - Author Name`;

      if (selectedAI === 'gemini') {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            parseQuoteResponse(generatedText);
            success = true;
          }
        }
      } else if (selectedAI === 'deepseek') {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-chat',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 1,
            max_tokens: 150,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.choices?.[0]?.message?.content;
          if (generatedText) {
            parseQuoteResponse(generatedText);
            success = true;
          }
        }
      }

      if (success) {
        toast.success('Quote generated successfully!');
      } else {
        toast.error('Failed to generate quote. Please check your API configuration.');
      }
    } catch (error) {
      console.error('Error generating quote:', error);
      toast.error('Failed to generate quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseQuoteResponse = (text: string) => {
    const match = text.match(/"([^"]+)"\s*-\s*(.+)/);
    if (match) {
      const newQuote = match[1];
      const newAuthor = match[2];
      setQuote(newQuote);
      setAuthor(newAuthor);

      // Add to history
      const newHistoryItem: SavedQuote = {
        id: Date.now().toString(),
        quote: newQuote,
        author: newAuthor,
        category: selectedCategory,
        timestamp: Date.now(),
      };

      setQuoteHistory((prev) => [newHistoryItem, ...prev.slice(0, 4)]);
    } else {
      setQuote(text.trim());
      setAuthor('AI Generated');

      // Add to history
      const newHistoryItem: SavedQuote = {
        id: Date.now().toString(),
        quote: text.trim(),
        author: 'AI Generated',
        category: selectedCategory,
        timestamp: Date.now(),
      };

      setQuoteHistory((prev) => [newHistoryItem, ...prev.slice(0, 4)]);
    }
  };

  const copyToClipboard = () => {
    if (quote) {
      navigator.clipboard.writeText(`"${quote}" - ${author}`);
      toast.success('Quote copied to clipboard!');
    }
  };

  const toggleFavorite = () => {
    if (quote) {
      const quoteId = `${quote}-${author}`;
      const isAlreadyFavorite = favorites.some((fav) => fav.id === quoteId);

      if (isAlreadyFavorite) {
        setFavorites((prev) => prev.filter((fav) => fav.id !== quoteId));
        toast.success('Removed from favorites');
      } else {
        const newFavorite: SavedQuote = {
          id: quoteId,
          quote,
          author,
          category: selectedCategory,
          timestamp: Date.now(),
        };
        setFavorites((prev) => [...prev, newFavorite]);
        toast.success('Added to favorites');
      }
    }
  };

  const showRandomFavorite = () => {
    if (favorites.length > 0) {
      const randomIndex = Math.floor(Math.random() * favorites.length);
      const randomFavorite = favorites[randomIndex];
      setQuote(randomFavorite.quote);
      setAuthor(randomFavorite.author);
      toast.success('Random favorite quote loaded!');
    } else {
      toast.error('No favorite quotes saved yet!');
    }
  };

  const loadHistoryQuote = (historyQuote: SavedQuote) => {
    setQuote(historyQuote.quote);
    setAuthor(historyQuote.author);
    toast.success('Quote loaded from history!');
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.success('All favorites cleared!');
  };

  const clearHistory = () => {
    setQuoteHistory([]);
    toast.success('Quote history cleared!');
  };

  const currentQuoteId = quote ? `${quote}-${author}` : '';
  const isFavorite = favorites.some((fav) => fav.id === currentQuoteId);

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
    >
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 floating-animation ${
            isDarkMode ? 'bg-purple-500' : 'bg-blue-400'
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 floating-animation-delayed ${
            isDarkMode ? 'bg-blue-500' : 'bg-purple-400'
          }`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl opacity-10 particle-float ${
            isDarkMode ? 'bg-pink-500' : 'bg-indigo-400'
          }`}
        ></div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full opacity-30 particle-float ${
              isDarkMode ? 'bg-purple-400' : 'bg-indigo-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        {/* Enhanced Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <Quote
                className={`md:w-16 w-8 h-8 md:h-16 ${
                  isDarkMode ? 'text-purple-400' : 'text-indigo-600'
                }`}
              />
              <div
                className={`absolute inset-0 w-16 h-16 blur-xl opacity-60 ${
                  isDarkMode ? 'bg-purple-400' : 'bg-indigo-400'
                } animate-pulse`}
              ></div>
              {/* Orbiting stars */}
              <Star
                className={`absolute -top-2 -right-2 md:w-4 w-3 h-3 md:h-4 ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-500'
                } animate-spin`}
                style={{ animationDuration: '8s' }}
              />
              <Sparkles
                className={`absolute -bottom-4 -left-2 w-4 h-4 ${
                  isDarkMode ? 'text-pink-400' : 'text-pink-500'
                } animate-pulse`}
              />
            </div>
            <h1
              className={`md:text-6xl font-bold bg-gradient-to-r ${
                isDarkMode
                  ? 'from-purple-400 via-pink-400 to-blue-400'
                  : 'from-indigo-600 via-purple-600 to-blue-600'
              } bg-clip-text text-transparent`}
            >
              AI Quote Generator
            </h1>
          </div>
          <p
            className={`md:text-2xl ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            } max-w-3xl mx-auto md:mb-8  mb-3 leading-relaxed`}
          >
            Generate inspiring quotes powered by advanced AI technology with beautiful animations
            and enhanced features
          </p>

          <Button
            variant="outline"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`group ${
              isDarkMode
                ? 'border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white hover:border-purple-400'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 hover:border-indigo-400'
            } transition-all duration-500 md:px-8 md:py-4 text-[13px] md:text-lg hover:scale-105 hover:shadow-xl mb-0`}
          >
            {isDarkMode ? (
              <Sun className="md:w-6 md:h-6 h-3 w-3 mr-3 group-hover:rotate-180 transition-transform duration-700" />
            ) : (
              <Moon className="md:w-6 md:h-6 mr-3 group-hover:-rotate-12 transition-transform duration-500" />
            )}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        {/* Enhanced Main Card */}
        <Card
          className={`${
            isDarkMode
              ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl shadow-purple-500/20'
              : 'bg-white/70 border-slate-200/50 shadow-2xl shadow-indigo-500/20'
          } backdrop-blur-xl transition-all duration-500 hover:shadow-3xl border-2 relative overflow-hidden`}
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 hover:opacity-100 transition-opacity duration-1000"></div>

          <CardContent className="relative p-12 space-y-12">
            {/* Controls */}
            <QuoteControls
              selectedAI={selectedAI}
              selectedCategory={selectedCategory}
              isDarkMode={isDarkMode}
              onAIChange={setSelectedAI}
              onCategoryChange={setSelectedCategory}
            />

            {/* Action Buttons */}
            <QuoteActions
              isLoading={isLoading}
              selectedAI={selectedAI}
              selectedCategory={selectedCategory}
              favoritesCount={favorites.length}
              isDarkMode={isDarkMode}
              onGenerate={generateQuote}
              onRandomFavorite={showRandomFavorite}
            />

            {/* Quote Display */}
            <QuoteDisplay
              quote={quote}
              author={author}
              isDarkMode={isDarkMode}
              isFavorite={isFavorite}
              onCopy={copyToClipboard}
              onToggleFavorite={toggleFavorite}
            />

            {/* Favorites Manager */}
            <FavoritesManager
              favorites={favorites}
              isDarkMode={isDarkMode}
              onClearFavorites={clearFavorites}
            />

            {/* Quote History */}
            <QuoteHistory
              quoteHistory={quoteHistory}
              isDarkMode={isDarkMode}
              onLoadHistoryQuote={loadHistoryQuote}
              onClearHistory={clearHistory}
            />
            {/* Footer */}
            <footer className="text-center text-sm text-slate-500 dark:text-slate-400 mt-16">
              <p>Made with ❤️ by sagar</p>
            </footer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
