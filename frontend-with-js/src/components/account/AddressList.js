import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  selectAddresses,
  deleteAddress,
} from '@/redux/slices/addressSlice';
import AddressForm from './AddressForm';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';

export default function AddressList() {
  const dispatch = useDispatch();
  const addresses = useSelector(selectAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        toast.success('Address deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete address');
      }
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="bg-white">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Shipping Addresses
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your shipping addresses
            </p>
          </div>
          <div className="ml-4 mt-4 flex-shrink-0">
            <button
              type="button"
              onClick={handleAddNew}
              className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add New Address
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <p className="mt-1 text-sm text-gray-500">
              You haven't added any addresses yet.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {addresses.map((address) => (
              <li
                key={address.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white border"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between space-x-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-sm font-medium text-gray-900">
                          {address.name}
                        </h3>
                        {address.isDefault && (
                          <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    <p>Phone: {address.phone}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <AddressForm
          address={editingAddress}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
