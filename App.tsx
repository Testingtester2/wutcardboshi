
import React, { useState, useMemo, useEffect } from 'react';
import { CardData, FilterState, SavedDeck, Comment } from './types';
import { generateCardPool } from './services/cardService';
import { Card } from './components/Card';
import { FilterBar } from './components/FilterBar';
import { DeckPanel } from './components/DeckPanel';
import { CommunityPanel } from './components/CommunityPanel';
import { BANNER_IMAGE_URL } from './constants';
import { X, LayoutGrid, Globe, Download, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [deck, setDeck] = useState<CardData[]>([]);
  const [activeTab, setActiveTab] = useState<'builder' | 'community'>('builder');
  
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    head: '',
    mouth: '',
    eyes: '',
    clothes: '',
    accessories: '',
    discipline: '',
    fur: ''
  });

  // Community State
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const cards = generateCardPool();
    setAllCards(cards);
    
    // Load decks from LocalStorage with new key
    const loadedDecks = localStorage.getItem('wutcardboshi_saved_decks');
    if (loadedDecks) {
      try {
        setSavedDecks(JSON.parse(loadedDecks));
      } catch (e) {
        console.error("Failed to load decks", e);
      }
    }
  }, []);

  // Persist Decks
  useEffect(() => {
    if (savedDecks.length > 0) {
      localStorage.setItem('wutcardboshi_saved_decks', JSON.stringify(savedDecks));
    }
  }, [savedDecks]);

  const filteredCards = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(([_, val]) => val !== '');
    
    if (activeFilters.length === 0) return allCards;

    return allCards.filter(card => {
      // We want to show cards that match ANY of the active filters' specific categories.
      // Since each card has only ONE category, we check if there is an active filter for THIS card's category.
      const filterValue = filters[card.category];
      
      // If a filter exists for this category and it's not empty, the card must match it.
      if (filterValue && filterValue !== '') {
        return card.traitValue === filterValue;
      }
      
      // If filters exist for other categories, but NOT for this card's category,
      // we usually hide this card in a "drill-down" search.
      return false;
    });
  }, [allCards, filters]).sort((a, b) => a.name.localeCompare(b.name));

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [category]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      head: '',
      mouth: '',
      eyes: '',
      clothes: '',
      accessories: '',
      discipline: '',
      fur: ''
    });
  };

  const handleAddToDeck = (cardId: string) => {
    if (deck.length >= 30) {
      alert("Your deck is full (30/30)!");
      return;
    }

    const cardToAdd = allCards.find(c => c.id === cardId);
    if (cardToAdd) {
      const existingCopies = deck.filter(c => c.name === cardToAdd.name).length;
      if (existingCopies >= 2) {
         alert(`You can only have 2 copies of ${cardToAdd.name}.`);
         return;
      }

      const newCardInstance = { ...cardToAdd, instanceId: Date.now() + Math.random() }; 
      setDeck(prev => [...prev, newCardInstance]);
    }
  };

  const handleRemoveFromDeck = (cardId: string) => {
    const index = deck.findIndex(c => c.id === cardId);
    if (index > -1) {
      const newDeck = [...deck];
      newDeck.splice(index, 1);
      setDeck(newDeck);
    }
  };

  const handleSaveDeck = (name: string, author: string, description: string) => {
    const newDeck: SavedDeck = {
      id: crypto.randomUUID(),
      name,
      author,
      description,
      cards: deck.map(c => c.name),
      likes: 0,
      comments: [],
      timestamp: Date.now()
    };
    setSavedDecks(prev => [...prev, newDeck]);
    setActiveTab('community');
  };

  const handleLikeDeck = (deckId: string) => {
    setSavedDecks(prev => prev.map(d => {
      if (d.id === deckId) return { ...d, likes: d.likes + 1 };
      return d;
    }));
  };

  const handleCommentDeck = (deckId: string, text: string, author: string) => {
    setSavedDecks(prev => prev.map(d => {
      if (d.id === deckId) {
        const newComment: Comment = {
          id: crypto.randomUUID(),
          author,
          text,
          timestamp: Date.now()
        };
        return { ...d, comments: [...d.comments, newComment] };
      }
      return d;
    }));
  };

  const handleLoadDeckFromCommunity = (cardNames: string[]) => {
    const newDeck: CardData[] = [];
    const nameCounts: Record<string, number> = {};

    for (const name of cardNames) {
      if (newDeck.length >= 30) break;
      const originalCard = allCards.find(c => c.name === name);
      if (originalCard) {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
        if (nameCounts[name] <= 2) {
             newDeck.push({ ...originalCard, instanceId: Math.random() });
        }
      }
    }
    setDeck(newDeck);
    setActiveTab('builder');
  };

  const exportContent = useMemo(() => {
    return deck.map(c => c.name).join('\n');
  }, [deck]);

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans bg-[#050505] text-gray-200">
      
      {/* 1. Header Banner */}
      <header className="relative h-[15vh] md:h-[18vh] shrink-0 bg-gray-900 overflow-hidden border-b border-orange-900/50 shadow-2xl z-30 group">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-[20s] ease-linear group-hover:scale-110"
          style={{ backgroundImage: `url(${BANNER_IMAGE_URL})` }}
        />
        {/* Scanline & Vignette */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/50 z-20" />
        
        <div className="absolute inset-0 flex items-center justify-center z-20 flex-col">
          <h1 className="text-4xl md:text-6xl tracking-widest drop-shadow-[0_4px_0_#000] text-white font-['Bangers'] uppercase transform -skew-x-6">
            <span className="text-orange-500 text-shadow-glow">Wutcardboshi</span>
          </h1>
        </div>

        {/* GUIDE LINK */}
        <a 
          href="https://online.fliphtml5.com/mhlgt/rdbe/#p=1"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-40 flex items-center gap-2 bg-white/10 hover:bg-orange-600 text-gray-200 hover:text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-all text-xs font-bold uppercase tracking-widest hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
        >
           <BookOpen size={16} />
           <span className="hidden sm:inline">Guide</span>
        </a>

        {/* Navigation Tabs */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center z-30">
            <div className="flex bg-gray-900/90 backdrop-blur-md rounded-t-xl overflow-hidden border-t border-x border-gray-700 shadow-2xl">
                <button 
                  onClick={() => setActiveTab('builder')}
                  className={`px-8 py-3 flex items-center gap-2 font-['Bangers'] tracking-wider text-lg transition-all duration-300 ${activeTab === 'builder' ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.5)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                    <LayoutGrid size={18}/> Builder
                </button>
                <div className="w-px bg-gray-700"></div>
                <button 
                  onClick={() => setActiveTab('community')}
                  className={`px-8 py-3 flex items-center gap-2 font-['Bangers'] tracking-wider text-lg transition-all duration-300 ${activeTab === 'community' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                >
                    <Globe size={18}/> Dogjo
                </button>
            </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-hidden bg-[#0a0a0a] relative">
        
        {/* VIEW: BUILDER */}
        {activeTab === 'builder' && (
          <div className="flex flex-col md:flex-row h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* LEFT: Gallery */}
            <section className="flex-1 flex flex-col h-full relative border-r border-gray-800">
              <FilterBar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onReset={handleResetFilters}
                count={filteredCards.length}
              />
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-[radial-gradient(circle_at_center,#151515_0%,#050505_100%)]">
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-20">
                   {filteredCards.map(card => (
                     <Card 
                        key={card.id} 
                        card={card} 
                        onClick={() => handleAddToDeck(card.id)} 
                     />
                   ))}
                   {filteredCards.length === 0 && (
                     <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-600 opacity-50">
                       <p className="text-3xl font-['Bangers'] tracking-wide mb-2">No Cards Found</p>
                       <p>Try adjusting your filters</p>
                     </div>
                   )}
                 </div>
              </div>
            </section>

            {/* RIGHT: Deck Panel */}
            <section className="h-[35vh] md:h-full md:w-[380px] lg:w-[420px] z-20 shadow-[ -10px_0_40px_rgba(0,0,0,0.5)]">
              <DeckPanel 
                deck={deck}
                onDropCard={handleAddToDeck}
                onRemoveCard={handleRemoveFromDeck}
                onClearDeck={() => setDeck([])}
                onExport={() => setIsExportModalOpen(true)}
                onSaveDeck={handleSaveDeck}
              />
            </section>
          </div>
        )}

        {/* VIEW: COMMUNITY */}
        {activeTab === 'community' && (
          <div className="h-full w-full animate-in zoom-in-95 duration-300">
             <CommunityPanel 
                decks={savedDecks}
                allCards={allCards} 
                onLike={handleLikeDeck}
                onComment={handleCommentDeck}
                onLoadDeck={handleLoadDeckFromCommunity}
             />
          </div>
        )}

      </main>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-100 transition-all">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-800/50">
              <h3 className="font-bold text-xl text-white font-['Bangers'] tracking-wide flex items-center gap-2">
                 <Download size={20} className="text-orange-500"/> Export Deck List
              </h3>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 bg-[#050505]">
              <textarea 
                readOnly
                className="w-full h-64 p-4 text-sm font-mono border border-gray-700 rounded bg-gray-900/50 text-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none selection:bg-orange-500/30"
                value={exportContent}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
              <p className="text-xs text-gray-500 mt-4 text-center uppercase tracking-widest">
                Click to select all • Ctrl+C to Copy
              </p>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-end bg-gray-900">
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded transition uppercase tracking-wider text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
