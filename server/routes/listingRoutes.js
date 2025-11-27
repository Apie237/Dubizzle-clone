// routes/listingRoutes.js - TEMPORARY VERSION WITHOUT CLOUDINARY
import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import Listing from '../models/Listing.js';
import Category from '../models/Category.js';

const router = express.Router();

// @desc    Get all listings with filters
// @route   GET /api/listings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      city,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    const query = { status: 'active' };

    if (category) query.category = category;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const listings = await Listing.find(query)
      .populate('category', 'name')
      .populate('user', 'name phone')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Listing.countDocuments(query);

    res.json({
      success: true,
      listings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Search listings with category-specific filters
// @route   GET /api/listings/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { category, ...filters } = req.query;
    
    const query = { status: 'active' };
    
    if (category) {
      query.category = category;
      
      if (filters.make) {
        query['customFields.make'] = filters.make;
      }
      if (filters.model) {
        query['customFields.model'] = new RegExp(filters.model, 'i');
      }
      if (filters.minYear || filters.maxYear) {
        query['customFields.year'] = {};
        if (filters.minYear) query['customFields.year'].$gte = Number(filters.minYear);
        if (filters.maxYear) query['customFields.year'].$lte = Number(filters.maxYear);
      }
      if (filters.bedrooms) {
        query['customFields.bedrooms'] = Number(filters.bedrooms);
      }
      if (filters.propertyType) {
        query['customFields.propertyType'] = filters.propertyType;
      }
    }
    
    const listings = await Listing.find(query)
      .populate('category user')
      .sort('-createdAt')
      .limit(50);
    
    res.json({ success: true, listings });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search error', error: error.message });
  }
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('category')
      .populate('user', 'name email phone createdAt');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    listing.views += 1;
    await listing.save();

    res.json({ success: true, listing });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create new listing WITHOUT CLOUDINARY (TEMP)
// @route   POST /api/listings
// @access  Private
router.post('/', protect, upload.array('images', 8), async (req, res) => {
  try {
    console.log('Create listing request received');
    console.log('Body:', req.body);
    console.log('Files:', req.files?.length || 0, 'files');
    console.log('User:', req.user?._id);

    const { title, description, price, category, location, customFields } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { title: !!title, description: !!description, price: !!price, category: !!category }
      });
    }

    // Find category
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }
    console.log('Category found:', categoryDoc.name);

    // Parse JSON fields
    let parsedLocation;
    let parsedCustomFields;

    try {
      parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    } catch (err) {
      console.error('Location parse error:', err);
      return res.status(400).json({ message: 'Invalid location format', error: err.message });
    }

    try {
      parsedCustomFields = typeof customFields === 'string' ? JSON.parse(customFields) : customFields;
    } catch (err) {
      console.error('CustomFields parse error:', err);
      return res.status(400).json({ message: 'Invalid customFields format', error: err.message });
    }

    // Validate custom fields
    const fieldMap = new Map(categoryDoc.customFields.map(f => [f.fieldName, f]));
    const errors = [];

    for (const [fieldName, field] of fieldMap) {
      if (field.required && !parsedCustomFields[fieldName]) {
        errors.push(`${fieldName} is required`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // SKIP IMAGE UPLOAD - Just create empty array
    const images = [];
    console.log('⚠️  SKIPPING IMAGE UPLOAD - Cloudinary disabled temporarily');

    // Create listing
    console.log('Creating listing in database...');
    const listing = await Listing.create({
      title,
      description,
      price: Number(price),
      category,
      location: parsedLocation,
      customFields: parsedCustomFields,
      images, // Empty for now
      user: req.user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await listing.populate('category user', 'name email');
    console.log('✅ Listing created successfully:', listing._id);

    res.status(201).json({ success: true, listing });
  } catch (error) {
    console.error('Create listing error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
router.put('/:id', protect, upload.array('images', 8), async (req, res) => {
  try {
    console.log('Update listing request:', req.params.id);
    
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, price, customFields, existingImages } = req.body;

    // Parse existing images
    let images = [];
    try {
      images = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages || [];
    } catch (err) {
      console.error('ExistingImages parse error:', err);
      return res.status(400).json({ message: 'Invalid existingImages format' });
    }

    // Parse customFields
    let parsedCustomFields;
    try {
      parsedCustomFields = typeof customFields === 'string' ? JSON.parse(customFields) : customFields;
    } catch (err) {
      console.error('CustomFields parse error:', err);
      return res.status(400).json({ message: 'Invalid customFields format' });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price: Number(price),
        customFields: parsedCustomFields,
        images
      },
      { new: true, runValidators: true }
    );

    console.log('✅ Listing updated successfully');
    res.json({ success: true, listing });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await listing.deleteOne();
    console.log('Listing deleted:', req.params.id);

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get user's listings
// @route   GET /api/listings/user/my-listings
// @access  Private
router.get('/user/my-listings', protect, async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user._id })
      .populate('category', 'name')
      .sort('-createdAt');

    res.json({ success: true, listings });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;