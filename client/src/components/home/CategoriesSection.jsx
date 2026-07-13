import { Link } from 'react-router-dom';

const categories = [
  { name: 'Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80' },
  { name: 'Art', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80' },
  { name: 'Community', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&q=80' },
  { name: 'Health', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80' },
  { name: 'Education', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80' },
  { name: 'Environment', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80' },
];

export const CategoriesSection = () => (
  <section className="bg-gray-50 py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">Explore by Category</h2>
        <p className="mt-2 text-gray-500">Find campaigns in the areas you care about most.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/explore-campaigns?category=${encodeURIComponent(cat.name)}`}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gray-900/40 transition-colors group-hover:bg-gray-900/55" />
            <span className="absolute inset-0 flex items-center justify-center text-center font-semibold text-white">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
