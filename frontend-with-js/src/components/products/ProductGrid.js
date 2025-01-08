import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsPagination,
} from '@/redux/slices/productSlice';
import ProductCard from './ProductCard';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

export default function ProductGrid({ filters = {} }) {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const { currentPage, totalPages } = useSelector(selectProductsPagination);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, ...filters }));
  }, [dispatch, currentPage, filters]);

  const handlePageChange = (page) => {
    dispatch(fetchProducts({ page, ...filters }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
