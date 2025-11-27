// src/components/RelatedAds.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const RelatedAds = ({ currentListingId, categoryId, city }) => {
  const [relatedListings, setRelatedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchRelatedListings();
    }
  }, [currentListingId, categoryId, city]);

  const fetchRelatedListings = async () => {
    try {
      // Fetch listings from the same category, excluding current listing
      const { data } = await API.get(
        `/listings?category=${categoryId}&limit=8`
      );

      // Filter out current listing and prioritize same city
      let filtered = data.listings.filter(
        listing => listing._id !== currentListingId
      );

      // Sort by same city first, then by recent
      filtered = filtered.sort((a, b) => {
        if (a.location?.city === city && b.location?.city !== city) return -1;
        if (a.location?.city !== city && b.location?.city === city) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Take only 8 listings
      setRelatedListings(filtered.slice(0, 8));
    } catch (error) {
      console.error('Error fetching related listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Related Ads</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedListings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Ads</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedListings.map((listing) => (
          <Link
            key={listing._id}
            to={`/listings/${listing._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {listing.images && listing.images[0] ? (
                  <img
                    src={listing.images[0].url}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Same City Badge */}
                {listing.location?.city === city && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Same City
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-gray-800 group-hover:text-blue-600">
                  {listing.title}
                </h3>
                <p className="text-blue-600 font-bold text-lg mb-1">
                  AED {listing.price.toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs">
                  {listing.location?.city}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <Link
          to={`/category/${categoryId}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          View All Similar Ads
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default RelatedAds;