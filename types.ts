
export type TraitCategory = 'head' | 'mouth' | 'eyes' | 'clothes' | 'accessories' | 'discipline' | 'fur';

export interface CardData {
  id: string;
  name: string;
  category: TraitCategory;
  traitValue: string;
  imageUrl: string;
  instanceId?: number;
}

export interface FilterState {
  head: string;
  mouth: string;
  eyes: string;
  clothes: string;
  accessories: string;
  discipline: string;
  fur: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

export interface SavedDeck {
  id: string;
  name: string;
  author: string;
  description: string; // Added description field
  cards: string[]; // List of card names
  likes: number;
  comments: Comment[];
  timestamp: number;
}
