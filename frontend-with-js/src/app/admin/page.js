import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import UserManagement from '@/components/admin/UserManagement';
import Analytics from '@/components/admin/Analytics';

const navigation = [
  { name: 'Analytics', icon: ChartBarIcon, component: Analytics },
  { name: 'Products', icon: CubeIcon, component: ProductManagement },
  { name: 'Orders', icon: ShoppingBagIcon, component: OrderManagement },
  { name: 'Users', icon: UsersIcon, component: UserManagement },
];

export default function AdminDashboard() {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [currentTab, setCurrentTab] = useState('Analytics');

  // Redirect if user is not admin
  if (!user?.isAdmin) {
    router.push('/');
    return null;
  }

  const CurrentComponent = navigation.find(
    (item) => item.name === currentTab
  ).component;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-64 bg-white shadow md:block">
          <div className="flex h-full flex-col">
            <div className="flex flex-1 flex-col overflow-y-auto">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setCurrentTab(item.name)}
                      className={`group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium ${
                        currentTab === item.name
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon
                        className={`mr-3 h-6 w-6 flex-shrink-0 ${
                          currentTab === item.name
                            ? 'text-gray-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex w-full flex-col md:hidden">
          <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-4">
            <select
              value={currentTab}
              onChange={(e) => setCurrentTab(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {navigation.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {currentTab}
                </h1>
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="py-4">
                  <CurrentComponent />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
