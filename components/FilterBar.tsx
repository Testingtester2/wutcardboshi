
import React from 'react';
import { FilterState } from '../types';
import { HEAD_OPTIONS, MOUTH_OPTIONS, EYES_OPTIONS, CLOTHES_OPTIONS, ACCESSORIES_OPTIONS, DISCIPLINE_OPTIONS, FUR_OPTIONS } from '../constants';
import { Filter, RefreshCw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (category: keyof FilterState, value: string) => void;
  onReset: () => void;
  count: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onReset, count }) => {
  
  const renderSelect = (
    id: keyof FilterState, 
    options: { value: string; label: string }[], 
    label: string,
    accentColor: string
  ) => (
    <div className={`
      relative group flex items-center bg-gray-900/90 backdrop-blur-md 
      border-b-2 ${filters[id] ? accentColor : 'border-gray-700'} 
      hover:border-gray-500 transition-all duration-200
      rounded-t-md min-w-[120px] flex-1
    `}>
      <label htmlFor={id} className="absolute left-2 text-gray-500 pointer-events-none text-[10px] font-bold uppercase tracking-widest z-0 top-1.5">
         {label}
      </label>
      <select
        id={id}
        value={filters[id]}
        onChange={(e) => onFilterChange(id, e.target.value)}
        className="w-full pt-5 pb-1.5 px-2 text-sm text-white bg-transparent outline-none cursor-pointer font-sans appearance-none z-10 focus:bg-gray-800/50"
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value} className="bg-gray-900 text-gray-200">
            {/* Display the label exactly as is from constants. No "All" replacement. */}
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom Dropdown Arrow */}
      <div className="absolute right-2 top-1/2 translate-y-1 pointer-events-none text-gray-500">
        <svg width="8" height="5" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0L5 6L10 0H0Z"/></svg>
      </div>
    </div>
  );

  return (
    <div className="bg-[#111] border-b border-gray-800 p-4 sticky top-0 z-40 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-orange-500 shadow-orange-500/10 drop-shadow-sm">
          <Filter size={18} />
          <span className="font-['Bangers'] tracking-widest text-lg">Filter Cards</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5">
            {count} Cards
          </div>
          <button 
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors uppercase font-bold group"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500"/> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {renderSelect('fur', FUR_OPTIONS, 'Fur', 'border-zinc-500')}
        {renderSelect('head', HEAD_OPTIONS, 'Head', 'border-purple-500')}
        {renderSelect('mouth', MOUTH_OPTIONS, 'Mouth', 'border-red-500')}
        {renderSelect('eyes', EYES_OPTIONS, 'Eyes', 'border-cyan-500')}
        {renderSelect('clothes', CLOTHES_OPTIONS, 'Clothes', 'border-green-500')}
        {renderSelect('accessories', ACCESSORIES_OPTIONS, 'Accessory', 'border-yellow-500')}
        {renderSelect('discipline', DISCIPLINE_OPTIONS, 'Discipline', 'border-orange-500')}
      </div>
    </div>
  );
};
