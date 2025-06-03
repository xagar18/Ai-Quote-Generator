import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Moon, Quote, Sparkles, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Index = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // API keys - replace with your actual keys
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const OPENROUTER_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
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
      const selectedCategoryData = quoteCategories.find((cat) => cat.value === selectedCategory);
      const variations = [
        `Generate an inspiring and meaningful quote about "${selectedCategoryData?.label}". Make sure it is unique and distinct.`,
        `Provide a new and original quote about "${selectedCategoryData?.label}", ensuring it is fresh and different.`,
        `Share an insightful and inspiring quote regarding "${selectedCategoryData?.label}". Avoid repeating previously generated quotes.`,
        `Create a new powerful quote about "${selectedCategoryData?.label}". Ensure it has a different perspective from past responses.`,
        `Give a profound and thought-provoking quote on "${selectedCategoryData?.label}" that stands out from typical responses.`,
        `Craft a motivational and uplifting quote that captures the essence of "${selectedCategoryData?.label}".`,
        `Generate a timeless quote on "${selectedCategoryData?.label}" that offers a unique perspective.`,
        `Write an eye-opening quote about "${selectedCategoryData?.label}" that challenges conventional wisdom.`,
        `Create a quote that reflects deep wisdom about "${selectedCategoryData?.label}" and offers inspiration.`,
        `Share an unconventional yet powerful quote about "${selectedCategoryData?.label}".`,
        `Generate a rare and little-known quote that beautifully captures the meaning of "${selectedCategoryData?.label}".`,
        `Provide a quote that is poetic yet profound about "${selectedCategoryData?.label}".`,
        `Write a quote that carries a strong message about "${selectedCategoryData?.label}" with clarity and depth.`,
        `Generate a compelling quote about "${selectedCategoryData?.label}" that sparks curiosity and reflection.`,
        `Give a fresh and emotionally resonant quote about "${selectedCategoryData?.label}".`,
      ];

      const prompt = variations[Math.floor(Math.random() * variations.length)];

      if (selectedAI === 'gemini') {
        try {
          const response = await fetch(
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

          if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
          }

          const data = await response.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (generatedText) {
            parseQuoteResponse(generatedText);
            success = true;
          } else {
            console.warn('No valid response received from Gemini.');
          }
        } catch (error) {
          console.error('Error fetching AI response:', error);
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
            temperature: 0.8,
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
      setQuote(match[1]);
      setAuthor(match[2]);
    } else {
      setQuote(text.trim());
      setAuthor('AI Generated');
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDarkMode ? 'bg-purple-500' : 'bg-blue-400'
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDarkMode ? 'bg-blue-500' : 'bg-purple-400'
          }`}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <Quote
                className={`w-12 h-12 ${isDarkMode ? 'text-purple-400' : 'text-indigo-600'}`}
              />
              <div
                className={`absolute inset-0 w-12 h-12 blur-xl opacity-40 ${
                  isDarkMode ? 'bg-purple-400' : 'bg-indigo-400'
                } animate-pulse`}
              ></div>
            </div>
            <h1
              className={`text-5xl font-bold bg-gradient-to-r ${
                isDarkMode
                  ? 'from-purple-400 via-pink-400 to-blue-400'
                  : 'from-indigo-600 via-purple-600 to-blue-600'
              } bg-clip-text text-transparent`}
            >
              AI Quote Generator
            </h1>
          </div>
          <p
            className={`text-xl ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            } max-w-2xl mx-auto`}
          >
            Generate inspiring quotes powered by advanced AI technology
          </p>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`mt-8 group ${
              isDarkMode
                ? 'border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
            } transition-all duration-300 px-6 py-3`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="w-5 h-5 mr-2 group-hover:-rotate-12 transition-transform duration-300" />
            )}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        {/* Main Card */}
        <Card
          className={`${
            isDarkMode
              ? 'bg-slate-800/40 border-slate-700/50 shadow-2xl shadow-purple-500/10'
              : 'bg-white/60 border-slate-200/50 shadow-2xl shadow-indigo-500/10'
          } backdrop-blur-xl transition-all duration-500 hover:shadow-3xl border-2`}
        >
          <CardContent className="p-10 space-y-10">
            {/* Controls */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* AI Provider */}
              <div className="space-y-4">
                <label
                  className={`text-lg font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  } flex items-center gap-3`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isDarkMode ? 'bg-purple-400' : 'bg-indigo-500'
                    } animate-pulse`}
                  ></div>
                  AI Provider
                </label>
                <Select value={selectedAI} onValueChange={setSelectedAI}>
                  <SelectTrigger
                    className={`h-14 text-lg ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700'
                        : 'bg-white/80 border-slate-300 text-slate-900 hover:bg-white'
                    } transition-all duration-300 focus:ring-2 ${
                      isDarkMode ? 'focus:ring-purple-500' : 'focus:ring-indigo-500'
                    } backdrop-blur-sm`}
                  >
                    <SelectValue placeholder="Choose AI provider" />
                  </SelectTrigger>
                  <SelectContent
                    className={`${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 backdrop-blur-xl'
                        : 'bg-white border-slate-300 backdrop-blur-xl'
                    }`}
                  >
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

              {/* Category */}
              <div className="space-y-4">
                <label
                  className={`text-lg font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  } flex items-center gap-3`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isDarkMode ? 'bg-pink-400' : 'bg-purple-500'
                    } animate-pulse`}
                  ></div>
                  Quote Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger
                    className={`h-14 text-lg ${
                      isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700'
                        : 'bg-white/80 border-slate-300 text-slate-900 hover:bg-white'
                    } transition-all duration-300 focus:ring-2 ${
                      isDarkMode ? 'focus:ring-pink-500' : 'focus:ring-purple-500'
                    } backdrop-blur-sm`}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent
                    className={`${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 backdrop-blur-xl'
                        : 'bg-white border-slate-300 backdrop-blur-xl'
                    }`}
                  >
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

            {/* Generate Button */}
            <Button
              onClick={generateQuote}
              disabled={isLoading || !selectedAI || !selectedCategory}
              className={`w-full h-16 text-xl font-bold ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              } text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-3" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-3" />
                  Generate Quote
                </>
              )}
            </Button>

            {/* Quote Display */}
            {quote && (
              <div
                className={`mt-12 p-8 rounded-2xl border-l-4 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-slate-700/30 to-slate-800/30 border-purple-400 shadow-lg shadow-purple-500/20'
                    : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-500 shadow-lg shadow-indigo-500/20'
                } transform transition-all duration-700 animate-fade-in backdrop-blur-sm`}
              >
                <blockquote
                  className={`text-2xl leading-relaxed mb-8 font-medium italic ${
                    isDarkMode ? 'text-slate-100' : 'text-slate-800'
                  }`}
                >
                  "{quote}"
                </blockquote>
                <cite
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-purple-300' : 'text-indigo-600'
                  }`}
                >
                  — {author}
                </cite>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
