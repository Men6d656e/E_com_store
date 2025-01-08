import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import SearchBar from '@/components/common/SearchBar';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            All Products
          </h1>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="w-full max-w-lg">
            <SearchBar
              value={filters.search}
              onChange={(value) => handleFilterChange({ search: value })}
            />
          </div>
          <div className="ml-4">
            <ProductSort
              value={filters.sort}
              onChange={(value) => handleFilterChange({ sort: value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-x-8 gap-y-10">
          {/* Filters */}
          <div className="hidden lg:block">
            <ProductFilters filters={filters} onChange={handleFilterChange} />
          </div>

          {/* Product grid */}
          <div className="lg:col-span-3">
            <ProductGrid filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}
