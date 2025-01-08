'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Settings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  orderNumberPrefix: string;
  emailNotifications: boolean;
  maintenanceMode: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      setSettings(response.data);
    } catch (error) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setSettings(prev => {
      if (!prev) return prev;

      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof Settings],
            [child]: value
          }
        };
      }

      return {
        ...prev,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : type === 'number' 
            ? parseFloat(value) 
            : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await api.put('/admin/settings', settings);
      setSuccess('Settings updated successfully');
    } catch (error) {
      setError('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center">
        <p className="text-red-600">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your store configuration and preferences
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Store Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Store Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Store Name"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
              required
            />
            <Input
              label="Store Email"
              type="email"
              name="storeEmail"
              value={settings.storeEmail}
              onChange={handleChange}
              required
            />
            <Input
              label="Store Phone"
              name="storePhone"
              value={settings.storePhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Store Address */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Store Address</h2>
          </div>
          <div className="p-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Street Address"
              name="storeAddress.street"
              value={settings.storeAddress.street}
              onChange={handleChange}
              required
            />
            <Input
              label="City"
              name="storeAddress.city"
              value={settings.storeAddress.city}
              onChange={handleChange}
              required
            />
            <Input
              label="State/Province"
              name="storeAddress.state"
              value={settings.storeAddress.state}
              onChange={handleChange}
              required
            />
            <Input
              label="ZIP/Postal Code"
              name="storeAddress.zipCode"
              value={settings.storeAddress.zipCode}
              onChange={handleChange}
              required
            />
            <Input
              label="Country"
              name="storeAddress.country"
              value={settings.storeAddress.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Pricing & Shipping */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pricing & Shipping</h2>
          </div>
          <div className="p-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            <Input
              label="Tax Rate (%)"
              type="number"
              name="taxRate"
              value={settings.taxRate.toString()}
              onChange={handleChange}
              required
              min="0"
              max="100"
              step="0.01"
            />
            <Input
              label="Shipping Fee"
              type="number"
              name="shippingFee"
              value={settings.shippingFee.toString()}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
            <Input
              label="Free Shipping Threshold"
              type="number"
              name="freeShippingThreshold"
              value={settings.freeShippingThreshold.toString()}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Order Settings */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Order Settings</h2>
          </div>
          <div className="p-6 space-y-6">
            <Input
              label="Order Number Prefix"
              name="orderNumberPrefix"
              value={settings.orderNumberPrefix}
              onChange={handleChange}
              required
            />
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                Enable email notifications for new orders
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="maintenanceMode" className="text-sm text-gray-700">
                Enable maintenance mode
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={saving}
            disabled={saving}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
