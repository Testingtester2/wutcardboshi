import React, { useState } from 'react';
import { SavedDeck, CardData } from '../types';
import { ThumbsUp, MessageSquare, User, Clock, Play, ArrowLeft, Grid } from 'lucide-react';
import { Card } from './Card';

interface CommunityPanelProps {
  decks: SavedDeck[];
  allCards: CardData[];
  onLike: (deckId: string) => void;
  onComment: (deckId: string, text: string, author: string) => void;
  onLoadDeck: (deckCards: string[]) => void;
}

export const CommunityPanel: React.FC<CommunityPanelProps> = ({ decks, allCards, onLike, onComment, onLoadDeck }) => {
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const activeDeck = decks.find(d => d.id === activeDeckId);

  // Helper to reconstruct full card objects for display
  const getDeckCards = (cardNames: string[]) => {
    const displayCards: CardData[] = [];
    cardNames.forEach(name => {
        const found = allCards.find(c => c.name === name);
        if(found) displayCards.push(found);
    });
    return displayCards;
  };

  const handlePostComment = () => {
    if (!activeDeckId || !commentText.trim()) return;
    onComment(activeDeckId, commentText, commentAuthor || "Anonymous");
    setCommentText('');
  };

  // DETAIL VIEW
  if (activeDeck) {
    const displayCards = getDeckCards(activeDeck.cards);
    
    return (
      <div className="flex flex-col h-full bg-[#0a0a0a] animate-in slide-in-from-right duration-300">
        {/* Top Navigation */}
        <div className="p-4 md:px-8 py-6 bg-gradient-to-b from-gray-900 to-[#0a0a0a] border-b border-gray-800 flex items-center gap-4 shrink-0 sticky top-0 z-50">
          <button 
            onClick={() => setActiveDeckId(null)} 
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors border border-gray-700"
          >
             <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
             <h2 className="font-['Bangers'] text-3xl text-orange-500 tracking-wide drop-shadow-lg">{activeDeck.name}</h2>
             <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <span className="flex items-center gap-1"><User size={14}/> {activeDeck.author}</span>
                <span className="flex items-center gap-1"><Clock size={14}/> {new Date(activeDeck.timestamp).toLocaleDateString()}</span>
             </div>
          </div>
          <button 
            onClick={() => onLoadDeck(activeDeck.cards)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-['Bangers'] tracking-wider uppercase text-lg flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-transform active:scale-95"
          >
            <Play size={18} fill="currentColor" /> Load Deck
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Description & Comments */}
                <div className="space-y-8 order-2 lg:order-1">
                    {/* Description Box */}
                    <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-['Bangers'] text-xl text-white mb-4 flex items-center gap-2">
                            Description
                        </h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-sans text-sm">
                            {activeDeck.description || "No description provided."}
                        </p>
                        
                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-800">
                            <button 
                                onClick={() => onLike(activeDeck.id)}
                                className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors bg-gray-900 px-4 py-2 rounded-lg border border-gray-800"
                            >
                                <ThumbsUp size={18} /> <span className="font-bold">{activeDeck.likes}</span> Likes
                            </button>
                            <div className="flex items-center gap-2 text-gray-400 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                                <MessageSquare size={18} /> <span className="font-bold">{activeDeck.comments.length}</span> Comments
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-['Bangers'] text-xl text-white mb-4">Dogjo Chat</h3>
                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {activeDeck.comments.length === 0 ? (
                                <div className="text-center py-8 text-gray-600 italic text-sm">
                                    Be the first to comment on this deck!
                                </div>
                            ) : (
                                activeDeck.comments.map(comment => (
                                    <div key={comment.id} className="bg-gray-900/50 rounded-lg p-3 border border-gray-800/50">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span className="font-bold text-orange-400">{comment.author}</span>
                                            <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-300 text-sm">{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="space-y-3">
                            <input 
                                className="w-full bg-black/50 text-sm text-white p-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <div className="flex justify-between items-center gap-2">
                                <input 
                                    className="bg-black/50 text-xs text-gray-300 p-2 rounded-lg border border-gray-700 focus:border-orange-500 outline-none w-1/2"
                                    placeholder="Name (Optional)"
                                    value={commentAuthor}
                                    onChange={(e) => setCommentAuthor(e.target.value)}
                                />
                                <button 
                                    onClick={handlePostComment}
                                    disabled={!commentText.trim()}
                                    className="flex-1 bg-gray-800 hover:bg-orange-600 text-white text-xs font-bold uppercase py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Card Grid */}
                <div className="lg:col-span-2 order-1 lg:order-2">
                    <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-['Bangers'] text-xl text-white flex items-center gap-2">
                                Deck List <span className="text-gray-500 text-base font-sans font-normal">({displayCards.length} Cards)</span>
                            </h3>
                            <Grid size={20} className="text-gray-600"/>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {displayCards.map((card, idx) => (
                                <div key={idx} className="pointer-events-none">
                                    <Card card={card} />
                                </div>
                            ))}
                            {/* Fillers to keep grid nice if needed */}
                            {Array.from({ length: Math.max(0, 30 - displayCards.length) }).map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-xl border border-dashed border-gray-800 bg-gray-900/20 flex items-center justify-center">
                                    <span className="text-gray-800 font-bold">{displayCards.length + i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">
      <div className="p-6 md:px-12 bg-gradient-to-b from-gray-900 to-[#0a0a0a] border-b border-gray-800 flex flex-col md:flex-row justify-between items-end md:items-center gap-4 shrink-0">
        <div>
            <h2 className="font-['Bangers'] text-4xl text-orange-500 tracking-wide drop-shadow-md">The Dogjo</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-md">
                Browse top decks created in the Dogjo. Click on a deck to view strategies, comments, and load it into the builder.
            </p>
        </div>
        <div className="text-right hidden md:block">
            <div className="text-2xl font-bold text-white">{decks.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">Decks Created</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[radial-gradient(ellipse_at_top,#111_0%,#000_100%)] custom-scrollbar">
        {decks.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-50">
                 <div className="bg-gray-900 p-8 rounded-full mb-6">
                    <Grid size={48} className="text-gray-600" />
                 </div>
                 <p className="font-['Bangers'] text-3xl text-gray-500 mb-2">No Decks Found</p>
                 <p className="text-gray-600">Be the first to publish your deck to the Dogjo!</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {decks.sort((a,b) => b.timestamp - a.timestamp).map(deck => (
                    <div 
                        key={deck.id}
                        onClick={() => setActiveDeckId(deck.id)}
                        className="group relative bg-[#151515] border border-gray-800 hover:border-orange-500 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-900/20"
                    >
                        {/* Decorative Top Bar */}
                        <div className="h-2 w-full bg-gradient-to-r from-gray-800 to-gray-700 group-hover:from-orange-600 group-hover:to-red-600 transition-all" />
                        
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-['Bangers'] text-xl text-gray-100 group-hover:text-orange-400 transition-colors line-clamp-1 tracking-wide">
                                    {deck.name}
                                </h3>
                            </div>
                            
                            <p className="text-xs text-gray-500 line-clamp-2 mb-4 min-h-[2.5em]">
                                {deck.description || "No description provided."}
                            </p>

                            {/* Stats Row */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs text-gray-400">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                                        <ThumbsUp size={14}/> {deck.likes}
                                    </span>
                                    <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                                        <MessageSquare size={14}/> {deck.comments.length}
                                    </span>
                                </div>
                                <span className="bg-gray-900 px-2 py-1 rounded text-gray-500 font-bold">
                                    {deck.cards.length} Cards
                                </span>
                            </div>
                        </div>
                        
                        {/* Hover Overlay "View" */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                            <span className="bg-orange-600 text-white px-4 py-2 rounded font-bold uppercase text-xs tracking-widest shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                View Deck
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};