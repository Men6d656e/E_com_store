import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative bg-gray-900">
      <div className="relative h-80 overflow-hidden bg-indigo-600 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
        <img
          src="/images/hero.jpg"
          alt="Online shopping"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-indigo-600 mix-blend-multiply" />
      </div>
      <div className="relative mx-auto max-w-7xl py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="pl-6 pr-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Shop the Latest Trends
          </h1>
          <p className="mt-6 text-base text-gray-300">
            Discover our curated collection of fashion, electronics, home decor,
            and more. Get the best deals on premium products with our exclusive
            offers and discounts.
          </p>
          <div className="mt-8 flex space-x-4">
            <Link
              href="/products"
              className="inline-block rounded-md border border-transparent bg-white px-8 py-3 text-center font-medium text-indigo-600 hover:bg-gray-100"
            >
              Shop Now
            </Link>
            <Link
              href="/categories"
              className="inline-block rounded-md border border-white px-8 py-3 text-center font-medium text-white hover:bg-indigo-500"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
