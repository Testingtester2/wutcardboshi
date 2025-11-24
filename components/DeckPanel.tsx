import React, { useRef, useState } from 'react';
import { CardData } from '../types';
import { Card } from './Card';
import { Download, Trash2, Save, Copy, Info } from 'lucide-react';

interface DeckPanelProps {
  deck: CardData[];
  onDropCard: (cardId: string) => void;
  onRemoveCard: (cardId: string) => void;
  onClearDeck: () => void;
  onExport: () => void;
  onSaveDeck: (name: string, author: string, description: string) => void;
}

export const DeckPanel: React.FC<DeckPanelProps> = ({ 
  deck, 
  onDropCard, 
  onRemoveCard,
  onClearDeck,
  onExport,
  onSaveDeck
}) => {
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [description, setDescription] = useState('');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('ring-2', 'ring-orange-500', 'bg-gray-800');
    }
  };

  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('ring-2', 'ring-orange-500', 'bg-gray-800');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('ring-2', 'ring-orange-500', 'bg-gray-800');
    }
    const cardId = e.dataTransfer.getData("text/plain");
    if (cardId) {
      onDropCard(cardId);
    }
  };

  const handleSave = () => {
    if (!deckName.trim()) return alert("Please name your deck");
    onSaveDeck(deckName, authorName || "Anonymous", description);
    setDeckName('');
    setAuthorName('');
    setDescription('');
    setShowSaveInput(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#111] border-l border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#151515] to-[#1a1a1a] border-b border-gray-800 flex justify-between items-center shrink-0">
        <div>
          <h2 className="font-['Bangers'] text-2xl tracking-wider text-orange-500 drop-shadow-md">Your Deck</h2>
          <div className="flex items-center gap-2 mt-1">
             <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div 
                  className={`h-full ${deck.length === 30 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-orange-500'} transition-all duration-500`} 
                  style={{ width: `${(deck.length / 30) * 100}%` }} 
                />
             </div>
             <span className={`text-xs font-bold ${deck.length === 30 ? 'text-green-400' : 'text-gray-400'}`}>
               {deck.length}/30
             </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onClearDeck}
            disabled={deck.length === 0}
            className="p-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition disabled:opacity-20"
            title="Clear Deck"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={() => setShowSaveInput(!showSaveInput)}
            disabled={deck.length === 0}
            className={`p-2 rounded-lg transition disabled:opacity-20 ${showSaveInput ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-blue-900/20 hover:text-blue-300'}`}
            title="Save Deck to Dogjo"
          >
            <Save size={18} />
          </button>
          <button 
            onClick={onExport}
            disabled={deck.length === 0}
            className="p-2 text-gray-300 hover:bg-gray-700 rounded-lg transition disabled:opacity-20"
            title="Export Text"
          >
            <Copy size={18} />
          </button>
        </div>
      </div>

      {/* Save Form */}
      {showSaveInput && (
        <div className="p-4 bg-[#151515] border-b border-orange-900/30 animate-in slide-in-from-top-2 shadow-inner">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs text-gray-400 uppercase font-bold tracking-widest">
               <span>Save Deck</span>
               <button onClick={() => setShowSaveInput(false)}><Info size={12}/></button>
            </div>
            <input 
              type="text" 
              placeholder="Deck Name..." 
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
              className="bg-black/40 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-orange-500 outline-none transition-colors placeholder-gray-600"
            />
            <input 
              type="text" 
              placeholder="Your Name (Optional)..." 
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              className="bg-black/40 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-orange-500 outline-none transition-colors placeholder-gray-600"
            />
            <textarea
              placeholder="How to play this deck? (Description)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="bg-black/40 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-orange-500 outline-none h-20 resize-none transition-colors placeholder-gray-600"
            />
            <button 
              onClick={handleSave}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-orange-900/20"
            >
              Publish to Dogjo
            </button>
          </div>
        </div>
      )}

      {/* Deck Grid */}
      <div 
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex-1 overflow-y-auto p-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed custom-scrollbar"
      >
        {deck.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-700 pointer-events-none">
            <div className="bg-gray-900/50 p-6 rounded-full border border-gray-800 mb-4">
               <Download size={32} className="opacity-50" />
            </div>
            <p className="text-2xl font-['Bangers'] tracking-wide text-gray-600">DECK EMPTY</p>
            <p className="text-xs font-sans text-gray-600 uppercase tracking-widest mt-1">Drag cards here to build</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 content-start pb-10">
            {deck.map((card, index) => (
              <Card 
                key={`${card.id}-${index}-${card.instanceId}`} 
                card={card} 
                isDeckView={true} 
                onRemove={(id) => onRemoveCard(id)} 
              />
            ))}
            {/* Empty Slots placeholders */}
            {Array.from({ length: Math.max(0, 30 - deck.length) }).map((_, i) => (
               <div key={i} className="aspect-[3/4] rounded-xl border border-dashed border-gray-800 bg-gray-900/20 flex items-center justify-center group">
                 <span className="text-gray-800 group-hover:text-gray-700 font-bold text-lg transition-colors">{deck.length + i + 1}</span>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};