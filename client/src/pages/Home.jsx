// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoryListings, setCategoryListings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all categories
      const categoriesRes = await API.get('/categories');
      const allCategories = categoriesRes.data.categories;
      setCategories(allCategories);

      // Fetch listings for each category (limit 4 per category)
      const listingsByCategory = {};
      
      for (const category of allCategories) {
        try {
          const listingsRes = await API.get(`/listings?category=${category._id}&limit=4`);
          if (listingsRes.data.listings.length > 0) {
            listingsByCategory[category._id] = {
              category: category,
              listings: listingsRes.data.listings
            };
          }
        } catch (err) {
          console.error(`Error fetching listings for ${category.name}:`, err);
        }
      }

      setCategoryListings(listingsByCategory);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Buy and Sell Anything
          </h1>
          <p className="text-xl mb-8">
            Find great deals in your city
          </p>
          <Link
            to="/create-listing"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
          >
            Post Free Ad
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/category/${category._id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 text-center"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Category-wise Listings */}
      {Object.values(categoryListings).map(({ category, listings }) => (
        <div key={category._id} className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{category.icon}</span>
              <h2 className="text-2xl font-bold text-gray-800">
                {category.name} for Sale
              </h2>
            </div>
            <Link
              to={`/category/${category._id}`}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing._id}
                to={`/listings/${listing._id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-video bg-gray-200">
                  {listing.images && listing.images[0] ? (
                    <img
                      src={listing.images[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">
                    {listing.title}
                  </h3>
                  <p className="text-blue-600 font-bold text-xl mb-2">
                    AED {listing.price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{listing.location?.city}</span>
                    <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Divider between categories */}
          <div className="mt-8 border-t border-gray-200"></div>
        </div>
      ))}

      {/* Empty State */}
      {Object.keys(categoryListings).length === 0 && (
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-lg shadow p-12">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to post an ad!</p>
            <Link
              to="/create-listing"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Post Your First Ad
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;