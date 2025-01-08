import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from '@/redux/slices/cartSlice';
import { createOrder } from '@/redux/slices/orderSlice';
import { selectAddresses } from '@/redux/slices/addressSlice';
import { formatPrice } from '@/lib/utils';
import AddressForm from '@/components/account/AddressForm';
import Modal from '@/components/common/Modal';
import toast from 'react-hot-toast';

const steps = [
  { id: 'shipping', name: 'Shipping Information' },
  { id: 'payment', name: 'Payment Method' },
  { id: 'review', name: 'Review Order' },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const addresses = useSelector(selectAddresses);

  const [currentStep, setCurrentStep] = useState('shipping');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  if (cartItems.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleNextStep = () => {
    if (currentStep === 'shipping' && !selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    if (currentStep === 'shipping') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('review');
  };

  const handlePreviousStep = () => {
    if (currentStep === 'payment') setCurrentStep('shipping');
    else if (currentStep === 'review') setCurrentStep('payment');
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: cartItems,
        shippingAddress: selectedAddress,
        paymentMethod,
        total: cartTotal,
      };

      await dispatch(createOrder(orderData)).unwrap();
      await dispatch(clearCart());
      router.push('/checkout/success');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-16">
        {/* Steps */}
        <nav aria-label="Progress" className="mb-12">
          <ol className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative md:flex md:flex-1">
                <div
                  className={`flex items-center px-6 py-4 text-sm font-medium ${
                    currentStep === step.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-500'
                  }`}
                >
                  <span className="flex-shrink-0">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2">
                      {stepIdx + 1}
                    </span>
                  </span>
                  <span className="ml-4 text-sm font-medium">{step.name}</span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Shipping Step */}
        {currentStep === 'shipping' && (
          <div>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Select Shipping Address
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Choose from your saved addresses or add a new one.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`relative rounded-lg border p-4 ${
                      selectedAddress?.id === address.id
                        ? 'border-indigo-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <label className="flex cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        className="sr-only"
                        checked={selectedAddress?.id === address.id}
                        onChange={() => handleAddressSelect(address)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {address.name}
                        </p>
                        <p className="text-gray-500">{address.street}</p>
                        <p className="text-gray-500">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-gray-500">{address.country}</p>
                        <p className="text-gray-500">Phone: {address.phone}</p>
                      </div>
                    </label>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400"
                >
                  <span className="text-sm font-medium text-gray-600">
                    Add New Address
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === 'payment' && (
          <div>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Payment Method
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Select your preferred payment method.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative rounded-lg border p-4">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">
                        Credit/Debit Card
                      </span>
                    </span>
                  </label>
                </div>

                <div className="relative rounded-lg border p-4">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => handlePaymentMethodSelect(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">
                        PayPal
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Step */}
        {currentStep === 'review' && (
          <div>
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Review Your Order
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Please review your order details before placing the order.
                </p>
              </div>

              <div className="space-y-6">
                {/* Order Items */}
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Order Items
                  </h3>
                  <ul className="mt-4 divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex py-4">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h4>{item.name}</h4>
                              <p>{formatPrice(item.price)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Shipping Address
                  </h3>
                  <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-900">{selectedAddress.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedAddress.street}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedAddress.city}, {selectedAddress.state}{' '}
                      {selectedAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedAddress.country}
                    </p>
                    <p className="text-sm text-gray-500">
                      Phone: {selectedAddress.phone}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Payment Method
                  </h3>
                  <p className="mt-4 text-sm text-gray-500">
                    {paymentMethod === 'card'
                      ? 'Credit/Debit Card'
                      : 'PayPal'}
                  </p>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Order Summary
                  </h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Subtotal</p>
                      <p className="text-gray-900">{formatPrice(cartTotal)}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Shipping</p>
                      <p className="text-gray-900">Free</p>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <p className="text-base font-medium text-gray-900">Total</p>
                      <p className="text-base font-medium text-gray-900">
                        {formatPrice(cartTotal)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          {currentStep !== 'shipping' && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Previous
            </button>
          )}
          {currentStep !== 'review' ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Place Order
            </button>
          )}
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add New Address"
      >
        <AddressForm
          onSuccess={() => {
            setIsAddressModalOpen(false);
            toast.success('Address added successfully');
          }}
          onCancel={() => setIsAddressModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
