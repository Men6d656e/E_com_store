'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  imageUrl: string;
  features: string[];
  specifications: Record<string, string>;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel: string;
}

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
    features: [''],
    specifications: { '': '' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPreviewImage(initialData.imageUrl);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'imageUrl') {
      setPreviewImage(value);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSpecificationChange = (key: string, value: string, oldKey?: string) => {
    const newSpecifications = { ...formData.specifications };
    if (oldKey && oldKey !== key) {
      delete newSpecifications[oldKey];
    }
    newSpecifications[key] = value;
    setFormData(prev => ({
      ...prev,
      specifications: newSpecifications
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, '': '' }
    }));
  };

  const removeSpecification = (key: string) => {
    const newSpecifications = { ...formData.specifications };
    delete newSpecifications[key];
    setFormData(prev => ({
      ...prev,
      specifications: newSpecifications
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              fullWidth
            />

            <Input
              label="Stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home-living">Home & Living</option>
            </select>
          </div>

          <Input
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            fullWidth
          />

          {previewImage && (
            <div className="relative h-48 w-full rounded-lg overflow-hidden">
              <Image
                src={previewImage}
                alt="Product preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Features
            </label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex mb-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  fullWidth
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addFeature}
              size="sm"
            >
              Add Feature
            </Button>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Specifications
            </label>
            {Object.entries(formData.specifications).map(([key, value], index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Input
                  value={key}
                  onChange={(e) => handleSpecificationChange(e.target.value, value, key)}
                  placeholder="Specification name"
                />
                <Input
                  value={value}
                  onChange={(e) => handleSpecificationChange(key, e.target.value)}
                  placeholder="Specification value"
                />
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addSpecification}
              size="sm"
            >
              Add Specification
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
