import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductGrid from '@/components/products/ProductGrid';
import FeaturedProducts from '@/components/products/FeaturedProducts';
import CategoryList from '@/components/categories/CategoryList';
import Hero from '@/components/home/Hero';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import { fetchProducts } from '@/redux/slices/productSlice';

export default function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, featured: true }));
  }, [dispatch]);

  return (
    <div>
      <Hero />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Featured Categories
          </h2>
          <CategoryList />
        </div>

        <div className="py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <div className="mt-6">
            <FeaturedProducts />
          </div>
        </div>

        <div className="py-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            New Arrivals
          </h2>
          <div className="mt-6">
            <ProductGrid filters={{ sort: 'createdAt', limit: 8 }} />
          </div>
        </div>

        <div className="py-16">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
}
