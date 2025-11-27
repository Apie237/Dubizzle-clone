// server/seedListings.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from './models/Listing.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const seedListings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Get category IDs
    const categories = await Category.find();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('Categories found:', Object.keys(categoryMap));

    // Get or create a default user for listings
    let defaultUser = await User.findOne({ email: 'apieseh@gmail.com' });
    
    if (!defaultUser) {
      console.log('Creating demo user...');
      defaultUser = await User.create({
        name: 'apieh',
        email: 'apieseh@gmail.com',
        password: 'password123', // Will be hashed by the model
        phone: '+971501234567'
      });
      console.log('Demo user created');
    }

    // Listings data
    const listings = [
      {
        title: "Toyota Camry 2020 - Excellent Condition",
        description: "Well-maintained Toyota Camry with full service history. Single owner, regularly serviced at authorized dealer. Clean interior and exterior. Perfect family car with great fuel economy.",
        price: 65000,
        category: categoryMap['cars'],
        location: { city: "Dubai", area: "Al Barsha" },
        customFields: {
          make: "Toyota",
          model: "Camry",
          year: "2020",
          mileage: "45000",
          condition: "Used",
          fuelType: "Petrol",
          transmission: "Automatic",
          bodyType: "Sedan"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "BMW X5 2022 - Luxury SUV, Low Mileage",
        description: "Premium BMW X5 with all the extras. Leather seats, panoramic sunroof, advanced safety features, and entertainment system. Barely used, showroom condition. Full warranty remaining.",
        price: 285000,
        category: categoryMap['cars'],
        location: { city: "Abu Dhabi", area: "Saadiyat Island" },
        customFields: {
          make: "BMW",
          model: "X5",
          year: "2022",
          mileage: "12000",
          condition: "Used",
          fuelType: "Diesel",
          transmission: "Automatic",
          bodyType: "SUV"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Nissan Sunny 2018 - Budget Friendly",
        description: "Reliable Nissan Sunny perfect for daily commute. Good fuel efficiency, well maintained, no accidents. AC working perfectly. Great value for money.",
        price: 28000,
        category: categoryMap['cars'],
        location: { city: "Sharjah", area: "Al Nahda" },
        customFields: {
          make: "Nissan",
          model: "Sunny",
          year: "2018",
          mileage: "85000",
          condition: "Used",
          fuelType: "Petrol",
          transmission: "Manual",
          bodyType: "Sedan"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Cozy Studio Apartment in Dubai Marina",
        description: "Beautiful studio apartment with stunning marina view. Fully furnished with modern appliances, built-in wardrobes, and high-quality finishes. Located in prime location with easy access to metro, restaurants, and shopping malls.",
        price: 45000,
        category: categoryMap['real-estate'],
        location: { city: "Dubai", area: "Dubai Marina" },
        customFields: {
          propertyType: "Studio",
          listingType: "For Rent",
          bedrooms: "1",
          bathrooms: "1",
          area: "450",
          furnished: "Furnished",
          parking: "1",
          amenities: ["Pool", "Gym", "Security"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "5BR Villa with Private Pool - Palm Jumeirah",
        description: "Stunning luxury villa in exclusive Palm Jumeirah location. Spacious rooms, modern kitchen, private pool and garden. Beach access, 24/7 security, gym, and spa facilities. Perfect for families seeking premium lifestyle.",
        price: 18000000,
        category: categoryMap['real-estate'],
        location: { city: "Dubai", area: "Palm Jumeirah" },
        customFields: {
          propertyType: "Villa",
          listingType: "For Sale",
          bedrooms: "5",
          bathrooms: "6",
          area: "8500",
          furnished: "Semi-Furnished",
          parking: "4",
          amenities: ["Pool", "Gym", "Security", "Garden", "Balcony"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Modern Office Space in Business Bay",
        description: "Grade A office space in prime Business Bay tower. Open plan layout with glass partitions, fitted kitchen, and meeting rooms. High-speed internet ready, central AC, and 24/7 security. Multiple parking spaces included.",
        price: 120000,
        category: categoryMap['real-estate'],
        location: { city: "Dubai", area: "Business Bay" },
        customFields: {
          propertyType: "Office",
          listingType: "For Rent",
          bedrooms: "0",
          bathrooms: "2",
          area: "1200",
          furnished: "Unfurnished",
          parking: "5",
          amenities: ["Security", "Gym"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "3BR Townhouse in Quiet Community - Mudon",
        description: "Spacious 3-bedroom townhouse in family-friendly Mudon community. Includes private garden, covered parking, and storage room. Close to schools, parks, and shopping centers. Well-maintained community with pools and playgrounds.",
        price: 95000,
        category: categoryMap['real-estate'],
        location: { city: "Dubai", area: "Mudon" },
        customFields: {
          propertyType: "Townhouse",
          listingType: "For Rent",
          bedrooms: "3",
          bathrooms: "4",
          area: "2100",
          furnished: "Unfurnished",
          parking: "2",
          amenities: ["Pool", "Garden", "Security"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "MacBook Pro 16\" M2 - Like New Condition",
        description: "Barely used MacBook Pro 16\" with M2 chip. 16GB RAM, 512GB SSD. Includes original box, charger, and AppleCare+ warranty. Perfect for professionals and content creators. No scratches or dents.",
        price: 8500,
        category: categoryMap['electronics'],
        location: { city: "Dubai", area: "JLT" },
        customFields: {
          brand: "Apple",
          model: "MacBook Pro 16 M2",
          condition: "Used",
          warranty: ["Under Warranty"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Custom Built Gaming PC - RTX 4070, i7 13th Gen",
        description: "High-performance gaming PC with RTX 4070 graphics card, Intel i7 13th gen processor, 32GB RAM, 2TB NVMe SSD. Includes RGB case, liquid cooling, gaming keyboard and mouse. Runs all games at max settings.",
        price: 6500,
        category: categoryMap['electronics'],
        location: { city: "Abu Dhabi", area: "Khalifa City" },
        customFields: {
          brand: "Custom Built",
          model: "Gaming PC",
          condition: "Used",
          warranty: []
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Sony A7 III Camera with 2 Lenses",
        description: "Professional Sony A7 III mirrorless camera in excellent condition. Includes 28-70mm kit lens and 50mm f/1.8 prime lens. Original box, batteries, charger, and camera bag included. Low shutter count.",
        price: 7800,
        category: categoryMap['electronics'],
        location: { city: "Dubai", area: "Al Quoz" },
        customFields: {
          brand: "Sony",
          model: "A7 III",
          condition: "Used",
          warranty: []
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "iPad Pro 12.9\" with Magic Keyboard & Apple Pencil",
        description: "Latest iPad Pro 12.9\" with M2 chip, 256GB storage. Space Gray color. Includes Magic Keyboard and Apple Pencil 2. Under warranty, mint condition, used for light browsing only.",
        price: 4200,
        category: categoryMap['electronics'],
        location: { city: "Sharjah", area: "Al Majaz" },
        customFields: {
          brand: "Apple",
          model: "iPad Pro 12.9 M2",
          condition: "Like New",
          warranty: ["Under Warranty"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Modern L-Shaped Sofa - Grey Fabric",
        description: "Comfortable L-shaped sofa in excellent condition. Grey fabric upholstery, seats 6 people. Includes cushions. Perfect for living room or lounge area. Barely used, moving sale.",
        price: 2500,
        category: categoryMap['furniture'],
        location: { city: "Dubai", area: "Jumeirah Village Circle" },
        customFields: {
          furnitureType: "Sofa",
          material: "Fabric",
          condition: "Like New"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "King Size Bed with Mattress - Wooden Frame",
        description: "Beautiful king size bed with solid wood frame. Includes premium mattress in excellent condition. Headboard with storage compartments. Mattress is 2 years old, very comfortable.",
        price: 1800,
        category: categoryMap['furniture'],
        location: { city: "Abu Dhabi", area: "Al Raha" },
        customFields: {
          furnitureType: "Bed",
          material: "Wood",
          condition: "Used"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "6-Seater Dining Table Set - Glass Top",
        description: "Elegant dining table with glass top and 6 cushioned chairs. Modern design, perfect for family dinners. Table dimensions: 180cm x 90cm. Chairs in excellent condition with beige upholstery.",
        price: 3200,
        category: categoryMap['furniture'],
        location: { city: "Dubai", area: "Downtown" },
        customFields: {
          furnitureType: "Table",
          material: "Glass",
          condition: "Like New"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Executive Office Desk with Drawers",
        description: "Professional office desk made of solid wood. Large work surface (160cm x 80cm) with multiple drawers for storage. Cable management system included. Perfect condition, hardly used.",
        price: 1200,
        category: categoryMap['furniture'],
        location: { city: "Sharjah", area: "Al Nahda" },
        customFields: {
          furnitureType: "Desk",
          material: "Wood",
          condition: "Like New"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Senior Full Stack Developer - Tech Startup",
        description: "Exciting opportunity for experienced full stack developer to join innovative tech startup. Work with modern technologies including React, Node.js, and AWS. Collaborative team environment, flexible working hours, and opportunity for growth.",
        price: 18000,
        category: categoryMap['jobs'],
        location: { city: "Dubai", area: "Dubai Internet City" },
        customFields: {
          jobTitle: "Senior Full Stack Developer",
          jobType: "Full-time",
          experience: "5+ years",
          salary: "18000",
          benefits: ["Health Insurance", "Visa"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Marketing Manager - E-commerce Company",
        description: "Leading e-commerce company seeking experienced marketing manager. Responsibilities include digital marketing strategy, social media management, and campaign execution. Must have proven track record in online marketing.",
        price: 15000,
        category: categoryMap['jobs'],
        location: { city: "Dubai", area: "Business Bay" },
        customFields: {
          jobTitle: "Marketing Manager",
          jobType: "Full-time",
          experience: "3-5 years",
          salary: "15000",
          benefits: ["Health Insurance", "Visa", "Transportation"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Freelance Graphic Designer for Multiple Projects",
        description: "Looking for talented graphic designer for ongoing projects. Create marketing materials, social media content, and brand assets. Flexible schedule, work from home. Portfolio required.",
        price: 5000,
        category: categoryMap['jobs'],
        location: { city: "Dubai", area: "Remote" },
        customFields: {
          jobTitle: "Graphic Designer",
          jobType: "Freelance",
          experience: "1-2 years",
          salary: "5000",
          benefits: []
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Restaurant Manager - New Opening in Marina",
        description: "Upscale restaurant in Dubai Marina seeking experienced restaurant manager. Manage staff, oversee operations, ensure customer satisfaction. Previous experience in fine dining required. Excellent compensation package.",
        price: 12000,
        category: categoryMap['jobs'],
        location: { city: "Dubai", area: "Dubai Marina" },
        customFields: {
          jobTitle: "Restaurant Manager",
          jobType: "Full-time",
          experience: "3-5 years",
          salary: "12000",
          benefits: ["Health Insurance", "Visa", "Housing"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "iPhone 15 Pro Max 256GB - Natural Titanium",
        description: "Brand new iPhone 15 Pro Max in Natural Titanium color. 256GB storage, unlocked for all carriers. Includes original box, charger, and accessories. Under warranty with AppleCare+. Pristine condition.",
        price: 5200,
        category: categoryMap['mobile-phones'],
        location: { city: "Dubai", area: "Mall of Emirates" },
        customFields: {
          brand: "Apple",
          model: "iPhone 15 Pro Max",
          storage: "256GB",
          condition: "New",
          warranty: ["Under Warranty"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Samsung Galaxy S23 Ultra 512GB - Phantom Black",
        description: "Samsung S23 Ultra with S Pen, 512GB storage. Phantom Black color. Excellent camera quality, great for photography. Includes protective case and screen protector. 6 months old, mint condition.",
        price: 3800,
        category: categoryMap['mobile-phones'],
        location: { city: "Abu Dhabi", area: "Yas Island" },
        customFields: {
          brand: "Samsung",
          model: "Galaxy S23 Ultra",
          storage: "512GB",
          condition: "Used",
          warranty: ["Under Warranty"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "iPhone 13 128GB - Blue, Excellent Condition",
        description: "iPhone 13 in Blue, 128GB. Well maintained, battery health 95%. No scratches, comes with original box and charger. Perfect working condition. Great value for money.",
        price: 2100,
        category: categoryMap['mobile-phones'],
        location: { city: "Dubai", area: "Deira" },
        customFields: {
          brand: "Apple",
          model: "iPhone 13",
          storage: "128GB",
          condition: "Used",
          warranty: []
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "OnePlus 11 5G - 256GB, Fast Charging",
        description: "OnePlus 11 5G with 256GB storage. Snapdragon processor, excellent performance for gaming. Fast charging technology. Used for 3 months, like new condition. Includes case and screen protector.",
        price: 1850,
        category: categoryMap['mobile-phones'],
        location: { city: "Sharjah", area: "Al Khan" },
        customFields: {
          brand: "OnePlus",
          model: "OnePlus 11 5G",
          storage: "256GB",
          condition: "Like New",
          warranty: ["Under Warranty"]
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Authentic Gucci Handbag - Marmont Collection",
        description: "Authentic Gucci GG Marmont shoulder bag in black leather. Purchased from official Gucci store with receipt. Gently used, excellent condition. Comes with dust bag and authenticity card.",
        price: 6500,
        category: categoryMap['fashion-clothing'],
        location: { city: "Dubai", area: "Fashion District" },
        customFields: {
          category: "Women",
          itemType: "Bag",
          brand: "Gucci",
          condition: "Like New"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Hugo Boss Men's Suit - Navy Blue, Size 42R",
        description: "Professional Hugo Boss suit in navy blue. Size 42R jacket, 36W pants. Wool blend, perfect for business meetings. Dry cleaned and ready to wear. Worn only a few times.",
        price: 1200,
        category: categoryMap['fashion-clothing'],
        location: { city: "Dubai", area: "DIFC" },
        customFields: {
          category: "Men",
          itemType: "Shirt",
          size: "L",
          brand: "Hugo Boss",
          condition: "Used"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Kids Clothing Bundle - Age 5-6 Years, Mixed Items",
        description: "Bundle of 15 kids clothing items including shirts, pants, and dresses. Age 5-6 years, various brands. All items in good condition, freshly washed. Great value for growing kids.",
        price: 180,
        category: categoryMap['fashion-clothing'],
        location: { city: "Abu Dhabi", area: "Al Reef" },
        customFields: {
          category: "Kids",
          itemType: "Shirt",
          brand: "Various",
          condition: "Used"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Nike Air Max 90 - White/Black, Size 42",
        description: "Classic Nike Air Max 90 sneakers in white and black colorway. Size EU 42 / US 9. Worn a few times, excellent condition. Comes with original box. Comfortable and stylish.",
        price: 420,
        category: categoryMap['fashion-clothing'],
        location: { city: "Dubai", area: "City Walk" },
        customFields: {
          category: "Unisex",
          itemType: "Shoes",
          size: "L",
          brand: "Nike",
          condition: "Like New"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Home Treadmill - LCD Display, Foldable",
        description: "Quality home treadmill with LCD display showing time, speed, distance, and calories. Foldable design for easy storage. Multiple speed settings, perfect for home workouts. Barely used, like new condition.",
        price: 1800,
        category: categoryMap['sports-fitness'],
        location: { city: "Dubai", area: "Sports City" },
        customFields: {
          category: "Gym Equipment",
          brand: "ProForm",
          condition: "Like New",
          suitableFor: "Adults"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Mountain Bike 29\" - Shimano Gears, Front Suspension",
        description: "Quality mountain bike with 29\" wheels and front suspension. 21-speed Shimano gears, disc brakes. Perfect for off-road trails and city cycling. Well maintained, recently serviced.",
        price: 950,
        category: categoryMap['sports-fitness'],
        location: { city: "Abu Dhabi", area: "Corniche" },
        customFields: {
          category: "Bicycles",
          brand: "Giant",
          condition: "Used",
          suitableFor: "Adults"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Adjustable Dumbbells Set - 2.5kg to 25kg Each",
        description: "Professional adjustable dumbbell set. Each dumbbell adjusts from 2.5kg to 25kg. Space-saving design, replaces 15 sets of dumbbells. Includes stand. Perfect for home gym.",
        price: 1200,
        category: categoryMap['sports-fitness'],
        location: { city: "Dubai", area: "JBR" },
        customFields: {
          category: "Gym Equipment",
          brand: "Bowflex",
          condition: "Like New",
          suitableFor: "All Ages"
        },
        user: defaultUser._id,
        status: "active"
      },
      {
        title: "Official Match Football - Size 5",
        description: "Official size 5 football, FIFA approved. Excellent grip and durability. Used for a few matches, still in great condition. Perfect for training or casual games.",
        price: 85,
        category: categoryMap['sports-fitness'],
        location: { city: "Sharjah", area: "Al Nahda" },
        customFields: {
          category: "Sports Gear",
          brand: "Adidas",
          condition: "Used",
          suitableFor: "All Ages"
        },
        user: defaultUser._id,
        status: "active"
      }
    ];

    // Clear existing listings
    await Listing.deleteMany();
    console.log('Existing listings deleted');

    // Insert new listings
    const result = await Listing.insertMany(listings);
    console.log(`✅ ${result.length} listings seeded successfully`);

    // Show summary by category
    const summary = {};
    result.forEach(listing => {
      const catName = categories.find(c => c._id.equals(listing.category))?.name || 'Unknown';
      summary[catName] = (summary[catName] || 0) + 1;
    });

    console.log('\n📊 Listings by category:');
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} listings`);
    });

    console.log('\n💡 Demo user credentials:');
    console.log('  Email: apieseh@gmail.com');
    console.log('  Password: password123');

    process.exit();
  } catch (error) {
    console.error('Error seeding listings:', error);
    process.exit(1);
  }
};

seedListings();