import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import {
  fetchProductById,
  selectCurrentProduct,
  selectProductLoading,
} from '@/redux/slices/productSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { formatPrice } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorAlert from '@/components/common/ErrorAlert';
import ReviewsList from '@/components/reviews/ReviewsList';
import RelatedProducts from '@/components/products/RelatedProducts';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductLoading);
  const [selectedSize, setSelectedSize] = useState();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        size: selectedSize,
      })
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <ErrorAlert message="Product not found" />;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {product.images.map((image) => (
                  <div
                    key={image}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50"
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover object-center"
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="aspect-h-1 aspect-w-1 w-full">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover object-center sm:rounded-lg"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product.rating > rating
                          ? 'text-yellow-400'
                          : 'text-gray-300',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
                <a
                  href="#reviews"
                  className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {product.reviewCount} reviews
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700">
                {product.description}
              </div>
            </div>

            <div className="mt-6">
              {/* Size picker */}
              {product.sizes?.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-gray-900">Size</h2>
                  </div>

                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="mt-2"
                  >
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {product.sizes.map((size) => (
                        <RadioGroup.Option
                          key={size}
                          value={size}
                          className={({ active, checked }) =>
                            classNames(
                              'cursor-pointer focus:outline-none',
                              active
                                ? 'ring-2 ring-indigo-500 ring-offset-2'
                                : '',
                              checked
                                ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                              'flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1'
                            )
                          }
                        >
                          <RadioGroup.Label as="span">{size}</RadioGroup.Label>
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Quantity picker */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900">Quantity</h2>
                </div>

                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div id="reviews" className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Customer Reviews
          </h2>
          <ReviewsList productId={id} />
        </div>

        {/* Related products */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Related Products
          </h2>
          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={id}
          />
        </div>
      </div>
    </div>
  );
}
