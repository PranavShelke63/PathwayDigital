const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://PranavAdmin:TwKdpH!dUf4QKFp@pathway.zos2qgp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample Keyboard Data
const products = [
  {
    name: 'TUF-GAMING-K1',
    description: '',
    price: 4400,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/TUF-GAMING-K1/image_1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K1/image_1.jpg',
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K1/image_2.jpg',
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K1/image_3.jpg',
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K1/image_4.jpg',
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K1/image_5.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'RA04 TUF GAMING',
      auraSync: 'N',
      weight: '810g',
      cable: '1.8-meter rubber USB cable',
      backlighting: '5-zone RGB',
      layout: 'Full Size',
      os: 'Win10',
    },
    warranty: '1 Year'
  },
  {
    name: 'TUF-GAMING-K3',
    description: '',
    price: 0,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/TUF-GAMING-K3/image_1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K3/image_1.jpg',
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K3/image_2.jpg',
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K3/image_3.jpg',
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K3/image_4.jpg',
      'uploads/AsusProducts/Keyboard/TUF-GAMING-K3/image_5.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'TUF-GAMING',
      auraSync: 'N',
      weight: '810g',
      cable: '1.8-meter rubber USB cable',
      backlighting: '5-zone RGB',
      layout: 'Full Size',
      os: 'Win10',
    },
    warranty: '1 Year'
  },
  {
    name: 'STRIXSCOPEII-RX-TW',
    description: '',
    price: 0,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/STRIXSCOPEII-RX-TW/image_1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/STRIXSCOPEII-RX-TW/image_1.jpg',
      'uploads/AsusProducts/Keyboard/STRIXSCOPEII-RX-TW/image_2.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'ROG RX Optical Mechanical Switch',
      auraSync: 'YES',
      weight: '',
      cable: '',
      backlighting: 'RGB Per Key',
      layout: 'Full Size',
      os: 'Win11',
    },
    warranty: '1 Year'
  },
  {
    name: 'STRIX-SCOPE-NX-WL',
    description: '',
    price: 0,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/STRIX-SCOPE-NX-WL/image_1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/STRIX-SCOPE-NX-WL/image_1.jpg',
      'uploads/AsusProducts/Keyboard/STRIX-SCOPE-NX-WL/image_2.jpg',
      'uploads/AsusProducts/Keyboard/STRIX-SCOPE-NX-WL/image_3.jpg',
      'uploads/AsusProducts/Keyboard/STRIX-SCOPE-NX-WL/image_4.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'ROG NX Mechanical: Red/Brown',
      auraSync: 'YES',
      weight: '',
      cable: '',
      backlighting: 'Per-Key RGB LED',
      layout: 'Full Size',
      os: 'Win10, 11',
    },
    warranty: '1 Year'
  },
  {
    name: 'M603-FALCHION-RX',
    description: '',
    price: 0,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/M603-FALCHION-RX/1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/M603-FALCHION-RX/1.jpg',
      'uploads/AsusProducts/Keyboard/M603-FALCHION-RX/2.jpg',
      'uploads/AsusProducts/Keyboard/M603-FALCHION-RX/3.jpg',
      'uploads/AsusProducts/Keyboard/M603-FALCHION-RX/4.jpg',
      'uploads/AsusProducts/Keyboard/M603-FALCHION-RX/5.jpg',
      'uploads/AsusProducts/Keyboard/M603-FALCHION-RX/6.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'ROG RX Low-Profile Switch',
      auraSync: 'YES',
      weight: '599g',
      cable: 'USB type A to C Braided cable',
      backlighting: 'RGB Per Key',
      layout: '60%',
      os: 'Win10 or later',
    },
    warranty: '1 Year'
  },
  {
    name: 'STRIXSCOPE-RX-T-WL',
    description: '',
    price: 0,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/STRIXSCOPE-RX-T-WL/image_1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/STRIXSCOPE-RX-T-WL/image_1.jpg',
      'uploads/AsusProducts/Keyboard/STRIXSCOPE-RX-T-WL/image_2.jpg',
      'uploads/AsusProducts/Keyboard/STRIXSCOPE-RX-T-WL/image_3.jpg',
      'uploads/AsusProducts/Keyboard/STRIXSCOPE-RX-T-WL/image_4.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'Optical Mechanical Switch ROG RX BLUE',
      auraSync: 'YES',
      weight: '854g (without cable)',
      cable: '',
      backlighting: 'Per-Key RGB LED',
      layout: '80%',
      os: 'Win10, 11',
    },
    warranty: '1 Year'
  },
  {
    name: 'STRIX-SCOPE-TKL-ML',
    description: '',
    price: 0,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/STRIX-SCOPE-TKL-ML/image_1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/STRIX-SCOPE-TKL-ML/image_1.jpg',
      'uploads/AsusProducts/Keyboard/STRIX-SCOPE-TKL-ML/image_2.jpg',
      'uploads/AsusProducts/Keyboard/STRIX-SCOPE-TKL-ML/image_3.jpg',
      'uploads/AsusProducts/Keyboard/STRIX-SCOPE-TKL-ML/image_4.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'X806 STRIX Mechanical',
      auraSync: 'YES',
      weight: '1.04kg',
      cable: 'Detachable',
      backlighting: 'W-Key RGB LED',
      layout: 'TKL',
      os: 'Win10',
    },
    warranty: '1 Year'
  },
  {
    name: 'ROGSTRIX-SCOPE-RX',
    description: '',
    price: 13999,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/ROGSTRIX-SCOPE-RX/1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/ROGSTRIX-SCOPE-RX/1.jpg',
      'uploads/AsusProducts/Keyboard/ROGSTRIX-SCOPE-RX/2.jpg',
      'uploads/AsusProducts/Keyboard/ROGSTRIX-SCOPE-RX/3.jpg',
      'uploads/AsusProducts/Keyboard/ROGSTRIX-SCOPE-RX/4.jpg',
      'uploads/AsusProducts/Keyboard/ROGSTRIX-SCOPE-RX/5.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'ROG STRIX ROG RX RED Optical Mechanical',
      auraSync: 'YES',
      weight: '1.07kg',
      cable: '1.8m USB cable. USB passthrough',
      backlighting: 'Per-Key RGB LED',
      layout: 'Full Size',
      os: 'Win10, 11',
    },
    warranty: '1 Year'
  },
  {
    name: 'M701-ROG-AZOTH',
    description: '',
    price: 9999,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/M701-ROG-AZOTH/1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/M701-ROG-AZOTH/1.jpg',
      'uploads/AsusProducts/Keyboard/M701-ROG-AZOTH/2.jpg',
      'uploads/AsusProducts/Keyboard/M701-ROG-AZOTH/3.jpg',
      'uploads/AsusProducts/Keyboard/M701-ROG-AZOTH/4.jpg',
      'uploads/AsusProducts/Keyboard/M701-ROG-AZOTH/5.jpg',
      'uploads/AsusProducts/Keyboard/M701-ROG-AZOTH/6.jpg',
      'uploads/AsusProducts/Keyboard/M701-ROG-AZOTH/7.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'M701 ROG AZOTH/NXRD/US/PBT',
      auraSync: 'YES',
      weight: '1.18KG',
      cable: '2M USB BRAIDED',
      backlighting: 'All Keys RGB',
      layout: '75%',
      os: 'Win10',
    },
    warranty: '1 Year'
  },
  {
    name: 'ROG-CLAYMORE-II',
    description: '',
    price: 24999,
    category: 'ASUS Keyboard',
    brand: 'ASUS',
    image: 'uploads/AsusProducts/Keyboard/ROG-CLAYMORE-II/1.jpg',
    images: [
      'uploads/AsusProducts/Keyboard/ROG-CLAYMORE-II/1.jpg',
      'uploads/AsusProducts/Keyboard/ROG-CLAYMORE-II/2.jpg',
      'uploads/AsusProducts/Keyboard/ROG-CLAYMORE-II/3.jpg',
      'uploads/AsusProducts/Keyboard/ROG-CLAYMORE-II/4.jpg',
      'uploads/AsusProducts/Keyboard/ROG-CLAYMORE-II/5.jpg',
      'uploads/AsusProducts/Keyboard/ROG-CLAYMORE-II/6.jpg',
      'uploads/AsusProducts/Keyboard/ROG-CLAYMORE-II/7.jpg'
    ],
    stock: 10,
    specifications: {
      switch: 'ROG RX RED Optical Mechanical',
      auraSync: 'YES',
      weight: 'Approx. 1156g',
      cable: 'USB 2.0; RF 2.4',
      backlighting: 'Per-Key RGB LED',
      layout: 'Size (80%)',
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
    console.log('Successfully seeded keyboard products');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding keyboard products:', error);
    process.exit(1);
  }
};

// Run the seeder
seedProducts(); 