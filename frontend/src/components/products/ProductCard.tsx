'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        
        <p className="mt-1 text-gray-500 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              product.stock > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          <span className={`text-sm ${
            product.stock > 5
              ? 'text-green-600'
              : product.stock > 0
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}>
            {product.stock > 5
              ? 'In Stock'
              : product.stock > 0
              ? `Only ${product.stock} left`
              : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
