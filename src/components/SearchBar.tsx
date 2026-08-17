'use client';

import { useState } from 'react';
import IconifyIcon from '@/components/icons/IconifyIcon';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  onSearch, 
  placeholder = 'Search courses, tutors, or topics...', 
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 pl-10 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#28C0F4] focus:outline-none focus:ring-2 focus:ring-[#28C0F4]/20 transition-all"
      />
      <IconifyIcon 
        icon="lucide:search" 
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" 
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <IconifyIcon icon="lucide:x" className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
