import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import {
  fetchOrders,
  selectOrders,
  selectOrdersLoading,
} from '@/redux/slices/orderSlice';
import { formatDate, formatPrice } from '@/lib/utils';
import LoadingSpinner from '../common/LoadingSpinner';

const orderStatuses = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-green-100 text-green-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderHistory() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't placed any orders yet.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
            >
              <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                <div className="sm:flex lg:col-span-7">
                  <div className="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40">
                    <img
                      src={order.items[0].product.images[0]}
                      alt={order.items[0].product.name}
                      className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                    />
                  </div>

                  <div className="mt-6 sm:ml-6 sm:mt-0">
                    <h3 className="text-base font-medium text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <p className="mt-3 text-sm text-gray-500">
                      {order.items.length} items
                    </p>
                  </div>
                </div>

                <div className="mt-6 lg:col-span-5 lg:mt-0">
                  <dl className="grid grid-cols-2 gap-x-6 text-sm">
                    <div>
                      <dt className="font-medium text-gray-900">Order date</dt>
                      <dd className="mt-3 text-gray-500">
                        {formatDate(order.createdAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900">Status</dt>
                      <dd className="mt-3">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            orderStatuses[order.status]
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8">
                <h4 className="sr-only">Items</h4>
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-6">
                      <div className="flex items-center">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-6 flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-gray-900">
                              <Link
                                href={`/products/${item.product.id}`}
                                className="hover:text-indigo-600"
                              >
                                {item.product.name}
                              </Link>
                            </h5>
                            <p className="ml-4 text-sm font-medium text-gray-900">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          {item.size && (
                            <p className="mt-1 text-sm text-gray-500">
                              Size: {item.size}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div className="sm:flex">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Order Details
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
