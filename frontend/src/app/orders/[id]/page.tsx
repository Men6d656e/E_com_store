'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentDetails: {
    last4: string;
    nameOnCard: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${params.id}`);
      setOrder(response.data);
    } catch (error) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Order not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            Please try again later or contact support if the problem persists.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Order confirmation header */}
        <div className="text-center mb-12">
          <svg
            className="mx-auto h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your order. We'll send you shipping confirmation when your order ships.
          </p>
        </div>

        {/* Order details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Order header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Order #{order._id}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Order items */}
          <ul role="list" className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <li key={item._id} className="p-6 flex">
                <div className="relative h-24 w-24 rounded-md overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-6 flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/products/${item._id}`}>{item.name}</Link>
                    </h3>
                    <p className="ml-4 text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Order summary */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900">${order.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Shipping</p>
                <p className="text-gray-900">${order.shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Tax</p>
                <p className="text-gray-900">${order.tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-base font-medium">
                <p className="text-gray-900">Total</p>
                <p className="text-gray-900">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Shipping information */}
          <div className="border-t border-gray-200 px-6 py-4">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Shipping Information
            </h3>
            <address className="text-sm text-gray-600 not-italic">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.addressLine2 && (
                <>{order.shippingAddress.addressLine2}<br /></>
              )}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}<br />
              Phone: {order.shippingAddress.phone}
            </address>
          </div>

          {/* Payment information */}
          <div className="border-t border-gray-200 px-6 py-4">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Payment Information
            </h3>
            <p className="text-sm text-gray-600">
              Card ending in {order.paymentDetails.last4}<br />
              {order.paymentDetails.nameOnCard}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <Link href="/orders">
            <Button variant="secondary">View All Orders</Button>
          </Link>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
