import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Disclosure } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { fetchCategories, selectCategories } from '@/redux/slices/categorySlice';

const priceRanges = [
  { value: '0-50', label: 'Under $50' },
  { value: '50-100', label: '$50 to $100' },
  { value: '100-200', label: '$100 to $200' },
  { value: '200-500', label: '$200 to $500' },
  { value: '500+', label: '$500 & Above' },
];

const ratings = [
  { value: '4', label: '4 Stars & Up' },
  { value: '3', label: '3 Stars & Up' },
  { value: '2', label: '2 Stars & Up' },
  { value: '1', label: '1 Star & Up' },
];

export default function ProductFilters({ filters, onChange }) {
  const dispatch = useDispatch();
  const { categories } = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (categoryId) => {
    onChange({ category: categoryId });
  };

  const handlePriceChange = (range) => {
    const [min, max] = range.split('-');
    onChange({ minPrice: min, maxPrice: max === '+' ? '' : max });
  };

  const handleRatingChange = (rating) => {
    onChange({ rating });
  };

  return (
    <form className="sticky top-20">
      <h2 className="sr-only">Product filters</h2>

      {/* Categories */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Categories</span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={category.id}
                      name="category"
                      type="radio"
                      checked={filters.category === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={category.id}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Price range */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Price</span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <div className="space-y-4">
                {priceRanges.map((range) => (
                  <div key={range.value} className="flex items-center">
                    <input
                      id={`price-${range.value}`}
                      name="price"
                      type="radio"
                      checked={
                        filters.minPrice === range.value.split('-')[0] &&
                        filters.maxPrice === range.value.split('-')[1]
                      }
                      onChange={() => handlePriceChange(range.value)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`price-${range.value}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Rating */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Rating</span>
                <span className="ml-6 flex items-center">
                  {open ? (
                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.value} className="flex items-center">
                    <input
                      id={`rating-${rating.value}`}
                      name="rating"
                      type="radio"
                      checked={filters.rating === rating.value}
                      onChange={() => handleRatingChange(rating.value)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`rating-${rating.value}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {rating.label}
                    </label>
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </form>
  );
}
