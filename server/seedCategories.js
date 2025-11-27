import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';

dotenv.config();

const categories = [
  {
    name: 'Cars',
    slug: 'cars',
    icon: '🚗',
    description: 'Buy and sell new and used cars',
    customFields: [
      { fieldName: 'make', fieldType: 'dropdown', options: ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Nissan', 'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Volkswagen'], required: true, placeholder: 'Select make' },
      { fieldName: 'model', fieldType: 'text', required: true, placeholder: 'Enter model' },
      { fieldName: 'year', fieldType: 'number', required: true, placeholder: 'Enter year' },
      { fieldName: 'mileage', fieldType: 'number', required: true, placeholder: 'Mileage in km' },
      { fieldName: 'condition', fieldType: 'radio', options: ['New', 'Used'], required: true },
      { fieldName: 'fuelType', fieldType: 'dropdown', options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
      { fieldName: 'transmission', fieldType: 'radio', options: ['Automatic', 'Manual'], required: true },
      { fieldName: 'bodyType', fieldType: 'dropdown', options: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Pickup'], required: false }
    ]
  },
  {
    name: 'Real Estate',
    slug: 'real-estate',
    icon: '🏠',
    description: 'Find properties for sale or rent',
    customFields: [
      { fieldName: 'propertyType', fieldType: 'dropdown', options: ['Apartment', 'Villa', 'Townhouse', 'Studio', 'Penthouse', 'Office', 'Shop'], required: true, placeholder: 'Select property type' },
      { fieldName: 'listingType', fieldType: 'radio', options: ['For Sale', 'For Rent'], required: true },
      { fieldName: 'bedrooms', fieldType: 'number', required: true, placeholder: 'Number of bedrooms' },
      { fieldName: 'bathrooms', fieldType: 'number', required: true, placeholder: 'Number of bathrooms' },
      { fieldName: 'area', fieldType: 'number', required: true, placeholder: 'Area in sq ft' },
      { fieldName: 'furnished', fieldType: 'radio', options: ['Furnished', 'Unfurnished', 'Semi-Furnished'], required: false },
      { fieldName: 'parking', fieldType: 'number', required: false, placeholder: 'Parking spaces' },
      { fieldName: 'amenities', fieldType: 'checkbox', options: ['Pool', 'Gym', 'Security', 'Garden', 'Balcony'], required: false }
    ]
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: '💻',
    description: 'Buy and sell electronics and gadgets',
    customFields: [
      { fieldName: 'brand', fieldType: 'text', required: true, placeholder: 'Enter brand' },
      { fieldName: 'model', fieldType: 'text', required: false, placeholder: 'Enter model' },
      { fieldName: 'condition', fieldType: 'radio', options: ['New', 'Used', 'Refurbished'], required: true },
      { fieldName: 'warranty', fieldType: 'checkbox', options: ['Under Warranty'], required: false }
    ]
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    icon: '🛋️',
    description: 'Buy and sell furniture items',
    customFields: [
      { fieldName: 'furnitureType', fieldType: 'dropdown', options: ['Sofa', 'Bed', 'Table', 'Chair', 'Cabinet', 'Desk', 'Wardrobe'], required: true },
      { fieldName: 'material', fieldType: 'dropdown', options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric'], required: false },
      { fieldName: 'condition', fieldType: 'radio', options: ['New', 'Used', 'Like New'], required: true }
    ]
  },
  {
    name: 'Jobs',
    slug: 'jobs',
    icon: '💼',
    description: 'Find job opportunities',
    customFields: [
      { fieldName: 'jobTitle', fieldType: 'text', required: true, placeholder: 'Job title' },
      { fieldName: 'jobType', fieldType: 'radio', options: ['Full-time', 'Part-time', 'Contract', 'Freelance'], required: true },
      { fieldName: 'experience', fieldType: 'dropdown', options: ['Entry Level', '1-2 years', '3-5 years', '5+ years'], required: true },
      { fieldName: 'salary', fieldType: 'number', required: false, placeholder: 'Monthly salary' },
      { fieldName: 'benefits', fieldType: 'checkbox', options: ['Health Insurance', 'Visa', 'Transportation', 'Housing'], required: false }
    ]
  },
  {
    name: 'Mobile Phones',
    slug: 'mobile-phones',
    icon: '📱',
    description: 'Buy and sell mobile phones',
    customFields: [
      { fieldName: 'brand', fieldType: 'dropdown', options: ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'OnePlus', 'Google', 'Oppo'], required: true },
      { fieldName: 'model', fieldType: 'text', required: true, placeholder: 'Enter model' },
      { fieldName: 'storage', fieldType: 'dropdown', options: ['64GB', '128GB', '256GB', '512GB', '1TB'], required: false },
      { fieldName: 'condition', fieldType: 'radio', options: ['New', 'Used', 'Refurbished'], required: true },
      { fieldName: 'warranty', fieldType: 'checkbox', options: ['Under Warranty'], required: false }
    ]
  },
  // ========== NEW CATEGORIES BELOW ==========
  {
    name: 'Fashion & Clothing',
    slug: 'fashion-clothing',
    icon: '👗',
    description: 'Shop for clothes, shoes, and accessories',
    customFields: [
      { fieldName: 'category', fieldType: 'dropdown', options: ['Men', 'Women', 'Kids', 'Unisex'], required: true },
      { fieldName: 'itemType', fieldType: 'dropdown', options: ['Shirt', 'Pants', 'Dress', 'Shoes', 'Bag', 'Watch', 'Accessories'], required: true },
      { fieldName: 'size', fieldType: 'dropdown', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], required: false },
      { fieldName: 'brand', fieldType: 'text', required: false, placeholder: 'Brand name' },
      { fieldName: 'condition', fieldType: 'radio', options: ['New', 'Like New', 'Used'], required: true }
    ]
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    icon: '⚽',
    description: 'Sports equipment, gym gear, and fitness items',
    customFields: [
      { fieldName: 'category', fieldType: 'dropdown', options: ['Gym Equipment', 'Sports Gear', 'Bicycles', 'Outdoor Sports', 'Fitness Accessories'], required: true },
      { fieldName: 'brand', fieldType: 'text', required: false, placeholder: 'Brand name' },
      { fieldName: 'condition', fieldType: 'radio', options: ['New', 'Used', 'Like New'], required: true },
      { fieldName: 'suitableFor', fieldType: 'dropdown', options: ['Adults', 'Kids', 'All Ages'], required: false }
    ]
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
    
    await Category.deleteMany();
    console.log('Existing categories deleted');
    
    await Category.insertMany(categories);
    console.log(`✅ ${categories.length} categories seeded successfully`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();