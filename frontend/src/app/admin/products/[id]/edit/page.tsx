'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';

interface Props {
  params: {
    id: string;
  };
}

export default function EditProduct({ params }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/admin/products/${params.id}`);
      setProduct(response.data);
    } catch (error) {
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      await api.put(`/admin/products/${params.id}`, formData);
      router.push('/admin/products');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update product information using the form below.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          submitLabel="Update Product"
        />
      </div>
    </div>
  );
}
