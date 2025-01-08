'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/lib/api';

interface SearchResult {
  id: string;
  type: 'product' | 'category';
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      searchProducts();
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const searchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/search', {
        params: { query: debouncedQuery }
      });
      setResults(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    if (result.type === 'product') {
      router.push(`/products/${result.id}`);
    } else {
      router.push(`/categories/${result.id}`);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 pl-10 pr-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className={`w-5 h-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isLoading ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <ul className="py-2 max-h-96 overflow-auto">
            {results.map((result) => (
              <li
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  {result.imageUrl && (
                    <img
                      src={result.imageUrl}
                      alt={result.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{result.name}</p>
                    {result.type === 'product' && (
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-500">${result.price?.toFixed(2)}</p>
                        <span className="mx-2 text-gray-300">·</span>
                        <p className="text-xs text-gray-500 capitalize">{result.type}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="px-4 py-6 text-center text-gray-500">
            No results found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
