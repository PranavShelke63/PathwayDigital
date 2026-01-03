const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://PranavAdmin:TwKdpH!dUf4QKFp@pathway.zos2qgp.mongodb.net/?retryWrites=true&w=majority');

// Sample Mouse Data
const products = [
  {
    name: 'TUFGAMINGM3-GEN-II',
    description: 'Lightweight ASUS TUF Gaming M3 Gen II mouse with 8000 DPI sensor, 6 programmable buttons, and Aura Sync RGB for precision gaming.',
    price: 3499,
    brand: 'ASUS',
    image: 'uploads/ASUS/Mouse/TUFGAMINGM3-GEN-II/image_1.jpg',
    images: [
      'uploads/ASUS/Mouse/TUFGAMINGM3-GEN-II/image_1.jpg',
      'uploads/ASUS/Mouse/TUFGAMINGM3-GEN-II/image_2.jpg',
      'uploads/ASUS/Mouse/TUFGAMINGM3-GEN-II/image_3.jpg',
      'uploads/ASUS/Mouse/TUFGAMINGM3-GEN-II/image_4.jpg',
      'uploads/ASUS/Mouse/TUFGAMINGM3-GEN-II/image_5.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'P309 TUF GAMING M3 GEN II',
      auraSync: 'YES',
      weight: '59g',
      cable: 'USB 2.0 (TypeC to TypeA)',
      dpi: '8000',
      backlighting: 'Yes',
      buttons: '6',
      os: 'Win10',
    },
    warranty: '1 Year'
  },
  {
    name: 'STRIX-IMPACT-III',
    description: 'ASUS ROG Strix Impact III mouse features a 12,000 DPI sensor, ultra-light 59g design, and customizable RGB for fast-paced gaming.',
    price: 5999,
    brand: 'ASUS',
    image: 'uploads/ASUS/Mouse/STRIX-IMPACT-III/image_1.jpg',
    images: [
      'uploads/ASUS/Mouse/STRIX-IMPACT-III/image_1.jpg',
      'uploads/ASUS/Mouse/STRIX-IMPACT-III/image_2.jpg',
      'uploads/ASUS/Mouse/STRIX-IMPACT-III/image_3.jpg',
      'uploads/ASUS/Mouse/STRIX-IMPACT-III/image_4.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'ROG Micro Switch',
      auraSync: 'YES',
      weight: '59g without cable',
      cable: 'ROG Paracord',
      dpi: '12000',
      backlighting: 'RGB',
      buttons: '5+1',
      os: 'Win10, 11',
    },
    warranty: '1 Year'
  },
  {
    name: 'TUF-GAMING-M4-AIR',
    description: 'ASUS TUF Gaming M4 Air is an ultralight 47g mouse with 16,000 DPI, paracord cable, and 6 programmable buttons for agile control.',
    price: 4499,
    brand: 'ASUS',
    image: 'uploads/ASUS/Mouse/TUF-GAMING-M4-AIR/image_1.jpg',
    images: [
      'uploads/ASUS/Mouse/TUF-GAMING-M4-AIR/image_1.jpg',
      'uploads/ASUS/Mouse/TUF-GAMING-M4-AIR/image_2.jpg',
      'uploads/ASUS/Mouse/TUF-GAMING-M4-AIR/image_3.jpg',
      'uploads/ASUS/Mouse/TUF-GAMING-M4-AIR/image_4.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'TUF GAMING',
      auraSync: 'YES',
      weight: '47g w/o cable',
      cable: 'TUF Gaming Paracord',
      dpi: '16,000 dpi',
      backlighting: 'ultralight',
      buttons: '6',
      os: 'Win10',
    },
    warranty: '1 Year'
  },
  {
    name: 'ROG-KERIS-AIMPOINT',
    description: 'ASUS ROG Keris AimPoint mouse offers 36,000 DPI, wireless and Bluetooth connectivity, and ergonomic design for competitive play.',
    price: 8999,
    brand: 'ASUS',
    image: 'uploads/ASUS/Mouse/ROG-KERIS-AIMPOINT/image_1.jpg',
    images: [
      'uploads/ASUS/Mouse/ROG-KERIS-AIMPOINT/image_1.jpg',
      'uploads/ASUS/Mouse/ROG-KERIS-AIMPOINT/image_2.jpg',
      'uploads/ASUS/Mouse/ROG-KERIS-AIMPOINT/image_3.jpg',
      'uploads/ASUS/Mouse/ROG-KERIS-AIMPOINT/image_4.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'ROG-KERIS (TypeC to TypeA); Bluetooth 5.1;',
      auraSync: 'YES',
      weight: '75g',
      cable: 'ROG Paracord',
      dpi: '36000',
      backlighting: 'RGB',
      buttons: '4',
      os: 'Win10',
    },
    warranty: '1 Year'
  },
  {
    name: 'P306-TUF-G-M4-WL',
    description: 'ASUS TUF Gaming M4 Wireless mouse with dual wireless modes, 12,000 DPI sensor, and 6 programmable buttons for versatile gaming.',
    price: 6999,
    brand: 'ASUS',
    image: 'uploads/ASUS/Mouse/P306-TUF-G-M4-WL/image_1.jpg',
    images: [
      'uploads/ASUS/Mouse/P306-TUF-G-M4-WL/image_1.jpg',
      'uploads/ASUS/Mouse/P306-TUF-G-M4-WL/image_2.jpg',
      'uploads/ASUS/Mouse/P306-TUF-G-M4-WL/image_3.jpg',
      'uploads/ASUS/Mouse/P306-TUF-G-M4-WL/image_4.jpg'
    ],
    stock: 10,
    specifications: {
      switch: '60 million click',
      auraSync: 'YES',
      weight: '62g w/o battery',
      cable: 'Dual Wireless',
      dpi: '12000',
      backlighting: 'RGB',
      buttons: '6',
      os: 'Win10',
    },
    warranty: '1 Year'
  },
  {
    name: 'P713-ROG-HARPE-ACE',
    description: 'ASUS ROG Harpe Ace Aim Lab Edition mouse features 36,000 DPI, ultra-light 54g build, and wireless connectivity for esports performance.',
    price: 14999,
    brand: 'ASUS',
    image: 'uploads/ASUS/Mouse/P713-ROG-HARPE-ACE/image_1.png',
    images: [
      'uploads/ASUS/Mouse/P713-ROG-HARPE-ACE/image_1.png',
      'uploads/ASUS/Mouse/P713-ROG-HARPE-ACE/image_2.jpg',
      'uploads/ASUS/Mouse/P713-ROG-HARPE-ACE/image_3.jpg',
      'uploads/ASUS/Mouse/P713-ROG-HARPE-ACE/image_4.jpg',
      'uploads/ASUS/Mouse/P713-ROG-HARPE-ACE/image_5.jpg',
      'uploads/ASUS/Mouse/P713-ROG-HARPE-ACE/image_6.jpg',
    ],
    stock: 10,
    specifications: {
      switch: 'ROG Micro Switch',
      auraSync: 'YES',
      weight: '54g',
      cable: 'Wireless, BT',
      dpi: '36000',
      backlighting: 'RGB',
      buttons: '5',
      os: 'Win10',
    },
    warranty: '1 Year'
  }
];

// Function to seed the database
const seedProducts = async () => {
  try {
    // Find or create the Mouse category
    let category = await Category.findOne({ name: 'Mouse' });
    if (!category) {
      category = await Category.create({ 
        name: 'Mouse', 
        description: 'Gaming and computer mice' 
      });
      console.log('Created Mouse category');
    } else {
      console.log('Found existing Mouse category');
    }

    // Update all products to use the category ID
    const productsWithCategory = products.map(product => ({
      ...product,
      category: category._id
    }));

    // Insert new products
    const result = await Product.insertMany(productsWithCategory);
    console.log(`Successfully seeded ${result.length} mouse products`);

    // Close the connection
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding mouse products:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeder
seedProducts(); 