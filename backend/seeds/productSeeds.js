const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://PranavAdmin:TwKdpH!dUf4QKFp@pathway.zos2qgp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample Products Data
const products = [
  {
    name: 'TUF-GAMING-H3',
    description: 'Durable ASUS TUF Gaming H3 headset with immersive sound, lightweight comfort, and a 3.5mm connector for versatile compatibility.',
    price: 4750,
    category: 'ASUS Headset',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Headset/TUF-GAMING-H3/1.jpg',
    images: [
      'uploads/AsusProducts/Headset/TUF-GAMING-H3/1.jpg',
      'uploads/AsusProducts/Headset/TUF-GAMING-H3/2.jpg',
      'uploads/AsusProducts/Headset/TUF-GAMING-H3/3.jpg',
      'uploads/AsusProducts/Headset/TUF-GAMING-H3/4.jpg',
      'uploads/AsusProducts/Headset/TUF-GAMING-H3/5.jpg',
      'uploads/AsusProducts/Headset/TUF-GAMING-H3/6.jpg'
    ],
    stock: 10,
    specifications: {
      partNumber: 'TUF GAMING',
      connector: '3.5 mm(1/8")',
      auraSync: 'N/A',
      weight: '344g',
      cable: '1.3M 3.5mm cable + 1.3M Y-cable'
    },
    warranty: '1 Year'
  },
  {
    name: 'TUF-GAM-H3-SILVER',
    description: 'ASUS TUF Gaming H3 Silver edition headset delivers clear audio and robust build quality, perfect for long gaming sessions.',
    price: 4750,
    category: 'ASUS Headset',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Headset/TUF-GAM-H3-SILVER/1.jpg',
    images: [
      'uploads/AsusProducts/Headset/TUF-GAM-H3-SILVER/1.jpg',
      'uploads/AsusProducts/Headset/TUF-GAM-H3-SILVER/2.jpg',
      'uploads/AsusProducts/Headset/TUF-GAM-H3-SILVER/3.jpg',
      'uploads/AsusProducts/Headset/TUF-GAM-H3-SILVER/4.jpg',
      'uploads/AsusProducts/Headset/TUF-GAM-H3-SILVER/5.jpg',
      'uploads/AsusProducts/Headset/TUF-GAM-H3-SILVER/6.jpg'
    ],
    stock: 10,
    specifications: {
      partNumber: 'TUF GAMING',
      connector: '3.5 mm(1/8")',
      auraSync: 'N/A',
      weight: '344g',
      cable: '1.3M 3.5mm cable + 1.3M Y-cable'
    },
    warranty: '1 Year'
  },
  {
    name: 'ROG-FUSION-II-300',
    description: 'ASUS ROG Fusion II 300 gaming headset features USB-A/USB-C connectivity, AI noise-cancelling, and customizable Aura Sync lighting.',
    price: 19999,
    category: 'ASUS Headset',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Headset/ROG-FUSION-II-300/1.jpg',
    images: [
      'uploads/AsusProducts/Headset/ROG-FUSION-II-300/1.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-300/2.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-300/3.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-300/4.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-300/5.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-300/6.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-300/7.jpg'
    ],
    stock: 10,
    specifications: {
      partNumber: '',
      connector: 'USB-A/USB-C',
      auraSync: 'Yes',
      weight: '310g',
      cable: 'USB-C cable; AI NC',
      foldable: true
    },
    warranty: '1 Year'
  },
  {
    name: 'ROG-FUSION-II-500',
    description: 'Premium ASUS ROG Fusion II 500 headset with advanced audio, USB-A/USB-C support, and immersive RGB lighting for gamers.',
    price: 22999,
    category: 'ASUS Headset',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Headset/ROG-FUSION-II-500/1.jpg',
    images: [
      'uploads/AsusProducts/Headset/ROG-FUSION-II-500/1.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-500/2.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-500/3.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-500/4.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-500/5.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-500/6.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-500/7.jpg',
      'uploads/AsusProducts/Headset/ROG-FUSION-II-500/8.jpg'
    ],
    stock: 10,
    specifications: {
      partNumber: '',
      connector: 'USB-A/USB-C',
      auraSync: 'Yes',
      weight: '310g',
      cable: 'USB-C cable; AI NC',
      foldable: true
    },
    warranty: '1 Year'
  },
  {
    name: 'ROG-DELTAS-ANIMATE',
    description: 'ASUS ROG Delta S Animate headset offers high-fidelity sound, customizable AniMe Matrix™ lighting, and USB connectivity for pro gamers.',
    price: 23999,
    category: 'ASUS Headset',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/1.jpg',
    images: [
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/1.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/2.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/3.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/4.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/5.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/6.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/7.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/image_1.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/image_2.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/image_3.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/image_4.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/image_5.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/image_6.jpg',
      'uploads/AsusProducts/Headset/ROG-DELTAS-ANIMATE/image_7.jpg'
    ],
    stock: 10,
    specifications: {
      partNumber: 'ROG Delta',
      connector: 'USB-A/USB-C',
      auraSync: 'Yes',
      weight: '310g',
      cable: 'USB-C cable; Lighting; Virtual 7.1',
      foldable: false
    },
    warranty: '1 Year'
  }
];




// Function to seed the database
const seedProducts = async () => {
  try {
    // Delete existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Successfully seeded products');

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seeder
seedProducts();