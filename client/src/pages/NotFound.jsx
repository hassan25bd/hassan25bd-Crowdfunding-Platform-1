import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
    <p className="text-7xl font-bold text-brand-600">404</p>
    <h1 className="mt-4 text-2xl font-bold text-gray-800">Page not found</h1>
    <p className="mt-2 max-w-md text-gray-500">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <Link
      to="/"
      className="mt-6 rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
    >
      Back to home
    </Link>
  </div>
);
