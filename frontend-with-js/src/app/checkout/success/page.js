import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-16">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircleIcon
              className="h-6 w-6 text-green-600"
              aria-hidden="true"
            />
          </div>
          <h1 className="mt-3 text-base font-semibold text-gray-900">
            Order Placed Successfully!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="mt-10">
            <h2 className="text-sm font-medium text-gray-900">
              What happens next?
            </h2>
            <div className="mt-4 space-y-4 text-sm">
              <p>
                1. You will receive an email confirmation with your order details.
              </p>
              <p>
                2. Our team will process your order and prepare it for shipping.
              </p>
              <p>
                3. Once your order ships, we'll send you tracking information.
              </p>
              <p>
                4. You can track your order status in your account dashboard.
              </p>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/account"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              View Order History
            </Link>
            <Link
              href="/products"
              className="text-sm font-semibold text-gray-900"
            >
              Continue Shopping <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
