'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  category: string;
}

interface RecommendationType {
  title: string;
  products: Product[];
  type: 'similar' | 'complementary' | 'popular' | 'trending' | 'personal';
}

interface Props {
  productId?: string;
  userId?: string;
  type?: 'product' | 'user' | 'category';
  limit?: number;
}

export default function ProductRecommendations({
  productId,
  userId,
  type = 'product',
  limit = 4
}: Props) {
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, [productId, userId, type]);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/recommendations', {
        params: {
          productId,
          userId,
          type,
          limit
        }
      });
      setRecommendations(response.data);
    } catch (error) {
      setError('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {recommendations.map((section) => (
        <div key={section.type}>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow duration-200 hover:shadow-md">
                  <div className="relative aspect-square">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.585l-7.07 4.124 1.35-7.867L.93 7.656l7.88-1.146L10 0l2.19 6.51 7.88 1.146-5.35 4.186 1.35 7.867z"
                          />
                        </svg>
                        <span className="ml-1 text-sm text-gray-600">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
