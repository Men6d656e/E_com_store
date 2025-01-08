'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { api } from '@/lib/api';

export default function NewProduct() {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    try {
      await api.post('/admin/products', formData);
      router.push('/admin/products');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a new product by filling out the form below.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm
          onSubmit={handleSubmit}
          submitLabel="Create Product"
        />
      </div>
    </div>
  );
}
