// backend/routes/categoryRoutes.js
import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Category from '../models/Category.js';
import Listing from '../models/Listing.js';

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { parent } = req.query;
    
    const query = { isActive: true };
    if (parent) {
      query.parentCategory = parent;
    } else if (parent === null || parent === 'null') {
      query.parentCategory = null;
    }

    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .sort('name');

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name slug');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategories = await Category.find({ parentCategory: category._id });

    res.json({
      success: true,
      category,
      subcategories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, description, icon, parentCategory, customFields } = req.body;

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      parentCategory,
      customFields
    });

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, description, icon, customFields, isActive } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : category.slug;

    category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        description,
        icon,
        customFields,
        isActive
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const listingCount = await Listing.countDocuments({ category: category._id });

    if (listingCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${listingCount} listings are using this category.`
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;