const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://PranavAdmin:TwKdpH!dUf4QKFp@pathway.zos2qgp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample Mouse Data
const products = [
  {
    name: 'TUFGAMINGM3-GEN-II',
    description: '',
    price: 3499,
    category: 'ASUS Mouse',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Mouse/TUFGAMINGM3-GEN-II/image_1.jpg',
    images: [
      'uploads/AsusProducts/Mouse/TUFGAMINGM3-GEN-II/image_1.jpg',
      'uploads/AsusProducts/Mouse/TUFGAMINGM3-GEN-II/image_2.jpg',
      'uploads/AsusProducts/Mouse/TUFGAMINGM3-GEN-II/image_3.jpg',
      'uploads/AsusProducts/Mouse/TUFGAMINGM3-GEN-II/image_4.jpg',
      'uploads/AsusProducts/Mouse/TUFGAMINGM3-GEN-II/image_5.jpg'
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
    description: '',
    price: 5999,
    category: 'ASUS Mouse',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Mouse/STRIX-IMPACT-III/image_1.jpg',
    images: [
      'uploads/AsusProducts/Mouse/STRIX-IMPACT-III/image_1.jpg',
      'uploads/AsusProducts/Mouse/STRIX-IMPACT-III/image_2.jpg',
      'uploads/AsusProducts/Mouse/STRIX-IMPACT-III/image_3.jpg',
      'uploads/AsusProducts/Mouse/STRIX-IMPACT-III/image_4.jpg'
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
    description: '',
    price: 4499,
    category: 'ASUS Mouse',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Mouse/TUF-GAMING-M4-AIR/image_1.jpg',
    images: [
      'uploads/AsusProducts/Mouse/TUF-GAMING-M4-AIR/image_1.jpg',
      'uploads/AsusProducts/Mouse/TUF-GAMING-M4-AIR/image_2.jpg',
      'uploads/AsusProducts/Mouse/TUF-GAMING-M4-AIR/image_3.jpg',
      'uploads/AsusProducts/Mouse/TUF-GAMING-M4-AIR/image_4.jpg'
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
    description: '',
    price: 8999,
    category: 'ASUS Mouse',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Mouse/ROG-KERIS-AIMPOINT/image_1.jpg',
    images: [
      'uploads/AsusProducts/Mouse/ROG-KERIS-AIMPOINT/image_1.jpg',
      'uploads/AsusProducts/Mouse/ROG-KERIS-AIMPOINT/image_2.jpg',
      'uploads/AsusProducts/Mouse/ROG-KERIS-AIMPOINT/image_3.jpg',
      'uploads/AsusProducts/Mouse/ROG-KERIS-AIMPOINT/image_4.jpg'
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
    description: '',
    price: 6999,
    category: 'ASUS Mouse',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Mouse/P306-TUF-G-M4-WL/image_1.jpg',
    images: [
      'uploads/AsusProducts/Mouse/P306-TUF-G-M4-WL/image_1.jpg',
      'uploads/AsusProducts/Mouse/P306-TUF-G-M4-WL/image_2.jpg',
      'uploads/AsusProducts/Mouse/P306-TUF-G-M4-WL/image_3.jpg',
      'uploads/AsusProducts/Mouse/P306-TUF-G-M4-WL/image_4.jpg'
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
    description: '',
    price: 14999,
    category: 'ASUS Mouse',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Mouse/P713-ROG-HARPE-ACE/image_1.png',
    images: [
      'uploads/AsusProducts/Mouse/P713-ROG-HARPE-ACE/image_1.png',
      'uploads/AsusProducts/Mouse/P713-ROG-HARPE-ACE/image_2.jpg',
      'uploads/AsusProducts/Mouse/P713-ROG-HARPE-ACE/image_3.jpg',
      'uploads/AsusProducts/Mouse/P713-ROG-HARPE-ACE/image_4.jpg',
      'uploads/AsusProducts/Mouse/P713-ROG-HARPE-ACE/image_5.jpg',
      'uploads/AsusProducts/Mouse/P713-ROG-HARPE-ACE/image_6.jpg',
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
    // await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Successfully seeded mouse products');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding mouse products:', error);
    process.exit(1);
  }
};

// Run the seeder
seedProducts(); 