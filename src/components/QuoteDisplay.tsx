import { Button } from '@/components/ui/button';
import { Copy, Download, Heart, Share2, Volume2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface QuoteDisplayProps {
  quote: string;
  author: string;
  isDarkMode: boolean;
  isFavorite: boolean;
  onCopy: () => void;
  onToggleFavorite: () => void;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  quote,
  author,
  isDarkMode,
  isFavorite,
  onCopy,
  onToggleFavorite,
}) => {
  if (!quote) return null;

  const shareQuote = async () => {
    const text = `"${quote}" - ${author}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Inspiring Quote',
          text: text,
        });
        toast.success('Quote shared successfully!');
      } catch (error) {
        navigator.clipboard.writeText(text);
        toast.success('Quote copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Quote copied to clipboard!');
    }
  };

  const speakQuote = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${quote}. By ${author}`);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      toast.success('Reading quote aloud!');
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const downloadQuote = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (isDarkMode) {
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#7c3aed');
    } else {
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(1, '#a855f7');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = isDarkMode ? '#f1f5f9' : '#1e293b';
    ctx.font = 'bold 32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const maxWidth = canvas.width - 100;
    const words = quote.split(' ');
    let line = '';
    let y = canvas.height / 2 - 50;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(`"${line}"`, canvas.width / 2, y);
        line = words[i] + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(`"${line}"`, canvas.width / 2, y);
    ctx.font = '24px serif';
    ctx.fillText(`— ${author}`, canvas.width / 2, y + 80);

    const link = document.createElement('a');
    link.download = 'quote.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="mt-12 relative">
      {/* Decorative elements adjusted */}
      <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl animate-pulse pointer-events-none"></div>
      <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-xl animate-pulse delay-1000 pointer-events-none"></div>

      <div className="relative p-8 rounded-3xl border-l-4 backdrop-blur-xl overflow-hidden z-10">
        <blockquote className="relative text-2xl md:text-3xl leading-relaxed mb-8 font-serif italic">
          <span className="relative z-10">{quote}</span>
        </blockquote>

        <cite className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-0.5"></div>
          {author}
        </cite>

        {/* Buttons with z-10 */}
        <div className="flex flex-wrap gap-3 mt-8 z-10">
          <Button onClick={onCopy} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button onClick={shareQuote} variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button onClick={speakQuote} variant="outline" size="sm">
            <Volume2 className="w-4 h-4 mr-2" /> Listen
          </Button>
          <Button onClick={onToggleFavorite} variant="outline" size="sm">
            <Heart className="w-4 h-4 mr-2" /> {isFavorite ? 'Unfavorite' : 'Favorite'}
          </Button>
          <Button onClick={downloadQuote} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
