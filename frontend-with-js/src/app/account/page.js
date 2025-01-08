import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tab } from '@headlessui/react';
import { selectUser } from '@/redux/slices/authSlice';
import ProfileForm from '@/components/account/ProfileForm';
import AddressList from '@/components/account/AddressList';
import OrderHistory from '@/components/account/OrderHistory';
import WishList from '@/components/account/WishList';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const tabs = [
  { name: 'Profile', component: ProfileForm },
  { name: 'Orders', component: OrderHistory },
  { name: 'Addresses', component: AddressList },
  { name: 'Wishlist', component: WishList },
];

export default function AccountPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const user = useSelector(selectUser);

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Account
          </h1>

          <div className="mt-8">
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-white text-indigo-600 shadow'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600'
                      )
                    }
                  >
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-8">
                {tabs.map((tab, idx) => (
                  <Tab.Panel
                    key={idx}
                    className={classNames(
                      'rounded-xl bg-white',
                      'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2'
                    )}
                  >
                    <tab.component user={user} />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
