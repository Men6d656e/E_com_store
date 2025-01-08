import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/20/solid';
import { addToCart } from '@/redux/slices/cartSlice';
import { formatPrice } from '@/lib/utils';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          <div className="mt-1 flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <StarIcon
                key={rating}
                className={classNames(
                  product.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                  'h-4 w-4 flex-shrink-0'
                )}
                aria-hidden="true"
              />
            ))}
            <span className="ml-1 text-sm text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(product.price)}
          </p>
          {product.compareAtPrice && (
            <p className="text-sm font-medium text-gray-500 line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add to cart
      </button>
    </div>
  );
}
