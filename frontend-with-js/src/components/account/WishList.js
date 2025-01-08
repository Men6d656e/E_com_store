import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import {
  fetchWishlist,
  removeFromWishlist,
  selectWishlist,
  selectWishlistLoading,
} from '@/redux/slices/wishlistSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { formatPrice } from '@/lib/utils';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function WishList() {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlist);
  const loading = useSelector(selectWishlistLoading);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success('Product removed from wishlist');
    } catch (error) {
      toast.error(error.message || 'Failed to remove product');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart({ product, quantity: 1 })).unwrap();
      await dispatch(removeFromWishlist(product.id)).unwrap();
      toast.success('Product added to cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add product to cart');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Your wishlist is empty
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Browse our products and add items to your wishlist.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ul className="divide-y divide-gray-200">
        {wishlist.map((item) => (
          <li key={item.id} className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={item.images[0]}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <h3>
                    <Link href={`/products/${item.id}`}>{item.name}</Link>
                  </h3>
                  <p className="ml-4">{formatPrice(item.price)}</p>
                </div>
                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
              </div>
              <div className="flex flex-1 items-end justify-between text-sm">
                <p className="text-gray-500">
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </p>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="font-medium text-gray-500 hover:text-gray-700"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
