// frontend/src/pages/CreateListing.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const CreateListing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: {
      city: '',
      area: ''
    },
    customFields: {}
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      fetchListing();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data.categories);
      console.log('Categories loaded:', data.categories.length);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  const fetchListing = async () => {
    try {
      const { data } = await API.get(`/listings/${id}`);
      const listing = data.listing;
      
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        location: listing.location,
        customFields: listing.customFields || {}
      });
      
      setSelectedCategory(listing.category._id);
      setExistingImages(listing.images || []);
      setImagePreviews(listing.images?.map(img => img.url) || []);
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError('Failed to load listing');
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    console.log('Category selected:', categoryId);
    setSelectedCategory(categoryId);
    if (!isEditMode) {
      setFormData({ ...formData, customFields: {} });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: { ...formData.location, [name]: value }
    });
  };

  const handleCustomFieldChange = (fieldName, value) => {
    setFormData({
      ...formData,
      customFields: { ...formData.customFields, [fieldName]: value }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + existingImages.length + files.length;
    
    if (totalImages > 8) {
      setError('Maximum 8 images allowed');
      return;
    }

    setImages([...images, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const isExistingImage = index < existingImages.length;
    
    if (isExistingImage) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    } else {
      const newImageIndex = index - existingImages.length;
      setImages(images.filter((_, i) => i !== newImageIndex));
      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Frontend Validation
    console.log('=== Form Validation ===');
    console.log('Selected Category:', selectedCategory);
    console.log('Title:', formData.title);
    console.log('Price:', formData.price);
    console.log('City:', formData.location.city);

    if (!selectedCategory) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description');
      setLoading(false);
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setError('Please enter a valid price');
      setLoading(false);
      return;
    }

    if (!formData.location.city.trim()) {
      setError('Please enter a city');
      setLoading(false);
      return;
    }

    // Validate custom fields
    const currentCategory = categories.find(cat => cat._id === selectedCategory);
    if (currentCategory && currentCategory.customFields) {
      for (const field of currentCategory.customFields) {
        if (field.required && !formData.customFields[field.fieldName]) {
          setError(`${field.fieldName} is required`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      console.log('=== Submitting Form ===');
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('category', selectedCategory);
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('customFields', JSON.stringify(formData.customFields));

      console.log('Category being sent:', selectedCategory);
      console.log('Custom fields:', formData.customFields);

      if (isEditMode) {
        submitData.append('existingImages', JSON.stringify(existingImages));
      }

      images.forEach(image => {
        submitData.append('images', image);
      });

      console.log('Images count:', images.length);

      let response;
      if (isEditMode) {
        console.log('Updating listing:', id);
        response = await API.put(`/listings/${id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        console.log('Creating new listing');
        response = await API.post('/listings', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      console.log('Success!', response.data);
      navigate(`/listings/${response.data.listing._id}`);
    } catch (err) {
      console.error('=== Submit Error ===');
      console.error('Error:', err);
      console.error('Response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          `Error ${isEditMode ? 'updating' : 'creating'} listing`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderCustomField = (field) => {
    const value = formData.customFields[field.fieldName] || '';

    switch (field.fieldType) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.fieldName, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.fieldName, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'dropdown':
        return (
          <select
            value={value}
            onChange={(e) => handleCustomFieldChange(field.fieldName, e.target.value)}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="flex gap-4 flex-wrap">
            {field.options.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.fieldName}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleCustomFieldChange(field.fieldName, e.target.value)}
                  required={field.required}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex gap-4 flex-wrap">
            {field.options.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    handleCustomFieldChange(field.fieldName, newValues);
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const currentCategory = categories.find(cat => cat._id === selectedCategory);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to create a listing.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {isEditMode ? 'Edit Listing' : 'Create New Listing'}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Category <span className="text-red-500">*</span>
              </h2>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
                disabled={isEditMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {isEditMode && (
                <p className="text-sm text-gray-500 mt-2">Category cannot be changed when editing</p>
              )}
              {selectedCategory && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Category selected: {categories.find(c => c._id === selectedCategory)?.name}
                </p>
              )}
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive title"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your item in detail"
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (AED) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.location.city}
                    onChange={handleLocationChange}
                    placeholder="Enter city"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.location.area}
                    onChange={handleLocationChange}
                    placeholder="Enter area"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Category-Specific Fields */}
            {currentCategory && currentCategory.customFields && currentCategory.customFields.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">{currentCategory.name} Details</h2>
                
                <div className="space-y-4">
                  {currentCategory.customFields.map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {field.fieldName.replace(/([A-Z])/g, ' $1').trim()}
                        {field.required && <span className="text-red-500"> *</span>}
                      </label>
                      {renderCustomField(field)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Photos</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Cover
                      </div>
                    )}
                  </div>
                ))}

                {(existingImages.length + images.length) < 8 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm text-gray-500 mt-2">Add Photo</span>
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Upload up to 8 photos. First photo will be the cover image.
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedCategory}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                loading || !selectedCategory
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading 
                ? (isEditMode ? 'Updating Listing...' : 'Creating Listing...') 
                : (isEditMode ? 'Update Listing' : 'Create Listing')
              }
            </button>

            {!selectedCategory && (
              <p className="text-center text-red-500 text-sm">
                Please select a category to enable submission
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;