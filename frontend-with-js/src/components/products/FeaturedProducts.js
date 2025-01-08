import { useSelector } from 'react-redux';
import { selectProducts, selectProductsLoading } from '@/redux/slices/productSlice';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FeaturedProducts() {
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
