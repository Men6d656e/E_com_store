import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  createAddress,
  updateAddress,
} from '@/redux/slices/addressSlice';
import toast from 'react-hot-toast';

export default function AddressForm({ address, onSuccess, onCancel }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: address?.name || '',
      street: address?.street || '',
      city: address?.city || '',
      state: address?.state || '',
      postalCode: address?.postalCode || '',
      country: address?.country || '',
      phone: address?.phone || '',
      isDefault: address?.isDefault || false,
    },
  });

  const onSubmit = async (data) => {
    try {
      if (address) {
        await dispatch(updateAddress({ id: address.id, ...data })).unwrap();
        toast.success('Address updated successfully');
      } else {
        await dispatch(createAddress(data)).unwrap();
        toast.success('Address added successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="street"
          className="block text-sm font-medium text-gray-700"
        >
          Street Address
        </label>
        <input
          type="text"
          id="street"
          {...register('street', { required: 'Street address is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.street && (
          <p className="mt-2 text-sm text-red-600">{errors.street.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            {...register('city', { required: 'City is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.city && (
            <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State / Province
          </label>
          <input
            type="text"
            id="state"
            {...register('state', { required: 'State is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.state && (
            <p className="mt-2 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700"
          >
            ZIP / Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            {...register('postalCode', { required: 'Postal code is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.postalCode && (
            <p className="mt-2 text-sm text-red-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <select
            id="country"
            {...register('country', { required: 'Country is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            {/* Add more countries as needed */}
          </select>
          {errors.country && (
            <p className="mt-2 text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
              message: 'Invalid phone number',
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.phone && (
          <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isDefault"
          type="checkbox"
          {...register('isDefault')}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor="isDefault"
          className="ml-2 block text-sm text-gray-900"
        >
          Set as default address
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : address ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}
