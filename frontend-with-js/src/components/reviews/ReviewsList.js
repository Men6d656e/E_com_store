import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StarIcon } from '@heroicons/react/20/solid';
import {
  fetchReviews,
  selectReviews,
  selectReviewsLoading,
} from '@/redux/slices/reviewSlice';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '../common/LoadingSpinner';
import ReviewForm from './ReviewForm';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ReviewsList({ productId }) {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectReviewsLoading);

  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-8">
      <ReviewForm productId={productId} />

      <div className="mt-8 flow-root">
        <div className="-my-12 divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review.id} className="py-12">
              <div className="flex items-center">
                <img
                  src={review.user.avatar || '/images/default-avatar.png'}
                  alt={`${review.user.name}`}
                  className="h-12 w-12 rounded-full"
                />
                <div className="ml-4">
                  <h4 className="text-sm font-bold text-gray-900">
                    {review.user.name}
                  </h4>
                  <div className="mt-1 flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          review.rating > rating
                            ? 'text-yellow-400'
                            : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{review.rating} out of 5 stars</p>
                </div>
              </div>

              <div className="mt-4 space-y-6 text-base italic text-gray-600">
                {review.comment}
              </div>

              {review.images?.length > 0 && (
                <div className="mt-4 flex gap-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                <time dateTime={review.createdAt}>
                  {formatDate(review.createdAt)}
                </time>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
