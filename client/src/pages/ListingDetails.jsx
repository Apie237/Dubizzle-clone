// src/pages/ListingDetails.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RelatedAds from '../components/RelatedAds';
import API from '../utils/api';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data } = await API.get(`/listings/${id}`);
      setListing(data.listing);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await API.delete(`/listings/${id}`);
        navigate('/my-listings');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete listing');
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!listing) {
    return <div className="container mx-auto px-4 py-8">Listing not found</div>;
  }

  const isOwner = user && listing.user._id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={listing.images[currentImageIndex].url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {listing.images.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {listing.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              currentImageIndex === index
                                ? 'border-blue-600'
                                : 'border-transparent'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`${listing.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No images available</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                    <p className="text-blue-600 text-3xl font-bold">
                      AED {listing.price.toLocaleString()}
                    </p>
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-listing/${listing._id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-4">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>

                {/* Custom Fields */}
                {listing.customFields && Object.keys(listing.customFields).length > 0 && (
                  <div className="border-t pt-4">
                    <h2 className="text-xl font-semibold mb-3">Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(listing.customFields).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-gray-600 text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-semibold">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <p className="text-gray-500 text-sm">
                    Views: {listing.views} | Posted:{' '}
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Seller Info */}
              <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-4">
                <h3 className="text-xl font-semibold mb-4">Seller Information</h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">Name:</span>{' '}
                    {listing.user.name}
                  </p>
                  {listing.user.phone && (
                    <p>
                      <span className="font-semibold">Phone:</span>{' '}
                      {listing.user.phone}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Location:</span>{' '}
                    {listing.location?.city}
                    {listing.location?.area && `, ${listing.location.area}`}
                  </p>
                </div>

                {!isOwner && (
                  <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Contact Seller
                  </button>
                )}
              </div>

              {/* Safety Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Safety Tips</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Meet in a public place</li>
                  <li>• Check the item before you buy</li>
                  <li>• Pay only after collecting the item</li>
                  <li>• Don't share personal information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Ads Section */}
      <div className="container mx-auto px-4 py-8">
        <RelatedAds 
          currentListingId={listing._id}
          categoryId={listing.category._id}
          city={listing.location?.city}
        />
      </div>
    </div>
  );
};

export default ListingDetails;