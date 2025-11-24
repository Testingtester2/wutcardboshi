
import React from 'react';
import { CardData } from '../types';
import { X } from 'lucide-react';

interface CardProps {
  card: CardData;
  onRemove?: (id: string) => void;
  isDeckView?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ card, onRemove, isDeckView = false, onClick }) => {
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", card.id);
    e.dataTransfer.effectAllowed = "copyMove";
  };

  // Determine border color based on category for a game-like "rarity" feel
  const getBorderColor = (cat: string) => {
    switch(cat) {
      case 'discipline': return 'border-orange-500 shadow-orange-500/20';
      case 'head': return 'border-purple-500 shadow-purple-500/20';
      case 'eyes': return 'border-cyan-500 shadow-cyan-500/20';
      case 'clothes': return 'border-green-500 shadow-green-500/20';
      case 'mouth': return 'border-red-500 shadow-red-500/20';
      case 'accessories': return 'border-yellow-500 shadow-yellow-500/20';
      case 'fur': return 'border-zinc-500 shadow-zinc-500/20';
      default: return 'border-gray-500 shadow-white/10';
    }
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onClick={onClick}
      className={`
        relative group flex flex-col items-center 
        bg-gradient-to-b from-gray-800 to-gray-900 
        rounded-xl border-2 ${getBorderColor(card.category)}
        overflow-hidden transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:border-white hover:z-20
        cursor-grab active:cursor-grabbing
        ${isDeckView ? 'w-20 sm:w-24 h-28 sm:h-32' : 'w-full aspect-[3/4]'}
        shadow-lg
      `}
    >
      {/* Glint Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

      {/* Remove Button for Deck View */}
      {isDeckView && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(card.id);
          }}
          className="absolute -top-2 -right-2 z-30 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 scale-75"
        >
          <X size={12} />
        </button>
      )}

      {/* Card Image */}
      <div className="w-full h-full relative">
        <img 
          src={card.imageUrl} 
          alt={card.name} 
          className="w-full h-full object-cover pointer-events-none select-none" 
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/300x400/222/888?text=${encodeURIComponent(card.name)}`;
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 ring-inset ring-1 ring-black/20 pointer-events-none"></div>
      </div>

      {/* Card Name Overlay */}
      <div className={`
        absolute bottom-0 left-0 w-full 
        bg-gradient-to-t from-black/90 via-black/70 to-transparent 
        p-2 pt-4 text-center z-10
      `}>
        <h3 className="text-[#f1eeea] text-xs sm:text-sm font-['Bangers'] tracking-wider uppercase drop-shadow-md leading-none truncate px-1">
          {card.name}
        </h3>
        {!isDeckView && (
           <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 left-0 w-full text-center bg-black/80 py-0.5">
             {card.category}
           </span>
        )}
      </div>
    </div>
  );
};
