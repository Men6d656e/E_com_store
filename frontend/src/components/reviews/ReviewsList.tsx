'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { StarIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import ReviewForm from './ReviewForm';

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

interface Props {
  productId: string;
}

export default function ReviewsList({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterBy, setFilterBy] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, filterBy]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/products/${productId}/reviews`, {
        params: {
          sort: sortBy,
          rating: filterBy,
        },
      });
      setReviews(response.data);
    } catch (error) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      await api.post(`/reviews/${reviewId}/helpful`);
      fetchReviews();
    } catch (error) {
      console.error('Failed to mark review as helpful');
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-gray-900">
              {getAverageRating()}
            </div>
            <div className="flex items-center justify-center md:justify-start mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Number(getAverageRating())
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Based on {totalReviews} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {Object.entries(distribution)
              .reverse()
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{rating} stars</div>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-yellow-400 rounded-full"
                        style={{
                          width: `${
                            totalReviews > 0
                              ? (count / totalReviews) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">
                    {count}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Write Review Button */}
        <div className="mt-6 text-center">
          <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Write a Review
            </h3>
            <ReviewForm
              productId={productId}
              onSuccess={() => {
                setShowReviewForm(false);
                fetchReviews();
              }}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating">Highest Rating</option>
        </select>

        <select
          value={filterBy || ''}
          onChange={(e) =>
            setFilterBy(e.target.value ? Number(e.target.value) : null)
          }
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-lg shadow p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <h4 className="font-medium text-gray-900 mt-2">{review.title}</h4>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>

            <p className="text-gray-600">{review.comment}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  By {review.userId.name}
                </span>
                {review.verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified Purchase
                  </span>
                )}
              </div>
              <button
                onClick={() => handleHelpful(review._id)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}

        {reviews.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
