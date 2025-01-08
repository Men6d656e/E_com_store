'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    title: 'Getting Started',
    links: [
      { href: '/', label: 'Introduction' },
      { href: '/installation', label: 'Installation' },
      { href: '/project-structure', label: 'Project Structure' },
      { href: '/architecture-overview', label: 'Architecture Overview' },
    ],
  },
  {
    title: 'Backend',
    links: [
      { href: '/backend/setup', label: 'Setup & Configuration' },
      { href: '/backend/models', label: 'Data Models' },
      { href: '/backend/controllers', label: 'Controllers' },
      { href: '/backend/routes', label: 'API Routes' },
      { href: '/backend/middleware', label: 'Middleware' },
      { href: '/backend/authentication', label: 'Authentication' },
      { href: '/backend/file-upload', label: 'File Upload' },
      { href: '/backend/email-service', label: 'Email Service' },
    ],
  },
  {
    title: 'Frontend (TypeScript)',
    links: [
      { href: '/frontend/setup', label: 'Setup & Configuration' },
      { href: '/frontend/typescript', label: 'TypeScript Setup' },
      { href: '/frontend/components', label: 'Components' },
      { href: '/frontend/hooks', label: 'Custom Hooks' },
      { href: '/frontend/api', label: 'API Integration' },
      { href: '/frontend/state', label: 'State Management' },
      { href: '/frontend/forms', label: 'Form Handling' },
      { href: '/frontend/routing', label: 'Routing' },
    ],
  },
  {
    title: 'Features',
    links: [
      { href: '/features/auth-flow', label: 'Authentication Flow' },
      { href: '/features/product-catalog', label: 'Product Catalog' },
      { href: '/features/shopping-cart', label: 'Shopping Cart' },
      { href: '/features/checkout', label: 'Checkout Process' },
      { href: '/features/order-management', label: 'Order Management' },
      { href: '/features/admin-dashboard', label: 'Admin Dashboard' },
      { href: '/features/inventory', label: 'Inventory System' },
      { href: '/features/reviews', label: 'Review System' },
      { href: '/features/search', label: 'Search & Filter' },
      { href: '/features/recommendations', label: 'Recommendations' },
    ],
  },
  {
    title: 'Advanced Topics',
    links: [
      { href: '/advanced/type-safety', label: 'Type Safety' },
      { href: '/advanced/performance', label: 'Performance' },
      { href: '/advanced/security', label: 'Security' },
      { href: '/advanced/testing', label: 'Testing' },
      { href: '/advanced/error-handling', label: 'Error Handling' },
    ],
  },
  {
    title: 'Deployment',
    links: [
      { href: '/deployment/backend', label: 'Backend Deployment' },
      { href: '/deployment/frontend', label: 'Frontend Deployment' },
      { href: '/deployment/monitoring', label: 'Monitoring' },
      { href: '/deployment/ci-cd', label: 'CI/CD Setup' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Documentation</h1>
      </div>
      <nav className="px-4 pb-6">
        {navigation.map((section, i) => (
          <div key={i} className="mb-8">
            <h2 className="px-3 mb-2 text-sm font-semibold text-gray-900">
              {section.title}
            </h2>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block px-3 py-2 text-sm rounded-md ${
                      pathname === link.href
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
