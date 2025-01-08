'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { state: cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create the order
      const response = await api.post('/orders', {
        items: cart.items,
        shippingAddress,
        paymentDetails: {
          last4: paymentDetails.cardNumber.slice(-4),
          nameOnCard: paymentDetails.nameOnCard
        },
        subtotal,
        shipping,
        tax,
        total
      });

      // Clear the cart and redirect to order confirmation
      clearCart();
      router.push(`/orders/${response.data._id}`);
    } catch (error: any) {
      setError(error.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Main content */}
        <div className="lg:col-span-7">
          {/* Progress steps */}
          <nav className="mb-8">
            <ol className="flex items-center">
              <li className={`relative pr-8 sm:pr-20 ${step === 'shipping' ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className="flex items-center">
                  <span className="rounded-full transition-colors flex items-center justify-center h-8 w-8 border-2 border-current">
                    1
                  </span>
                  <span className="ml-4 text-sm font-medium">Shipping</span>
                </div>
              </li>
              <li className={`relative ${step === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className="flex items-center">
                  <span className="rounded-full transition-colors flex items-center justify-center h-8 w-8 border-2 border-current">
                    2
                  </span>
                  <span className="ml-4 text-sm font-medium">Payment</span>
                </div>
              </li>
            </ol>
          </nav>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {step === 'shipping' ? (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <Input
                label="Full name"
                type="text"
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                required
                fullWidth
              />

              <Input
                label="Address line 1"
                type="text"
                value={shippingAddress.addressLine1}
                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                required
                fullWidth
              />

              <Input
                label="Address line 2 (optional)"
                type="text"
                value={shippingAddress.addressLine2}
                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                fullWidth
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="City"
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  required
                  fullWidth
                />

                <Input
                  label="State / Province"
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  required
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Postal code"
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  required
                  fullWidth
                />

                <Input
                  label="Country"
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  required
                  fullWidth
                />
              </div>

              <Input
                label="Phone number"
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                required
                fullWidth
              />

              <Button type="submit" fullWidth>
                Continue to Payment
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <Input
                label="Card number"
                type="text"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                required
                fullWidth
                placeholder="1234 5678 9012 3456"
              />

              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Expiry date"
                  type="text"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                  required
                  fullWidth
                  placeholder="MM/YY"
                />

                <Input
                  label="CVV"
                  type="text"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                  required
                  fullWidth
                  placeholder="123"
                />
              </div>

              <Input
                label="Name on card"
                type="text"
                value={paymentDetails.nameOnCard}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })}
                required
                fullWidth
              />

              <div className="flex justify-between space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep('shipping')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  fullWidth
                >
                  Place Order
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Order summary */}
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

          <div className="mt-6 space-y-4">
            <ul role="list" className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item._id} className="flex py-4">
                  <div className="flex-1 flex">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm text-gray-600">Shipping</p>
                  {shipping === 0 && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Free
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Tax</p>
                <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-gray-900">Order total</p>
                <p className="text-base font-medium text-gray-900">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
