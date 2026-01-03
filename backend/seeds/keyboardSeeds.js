const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://PranavAdmin:TwKdpH!dUf4QKFp@pathway.zos2qgp.mongodb.net/?retryWrites=true&w=majority');

// Sample Keyboard Data
const products = [
  {
    name: 'TUF-GAMING-K1',
    description: 'ASUS TUF Gaming K1 keyboard with 5-zone RGB, durable switches, and spill-resistant design for reliable gaming sessions.',
    price: 4400,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/TUF-GAMING-K1/image_1.jpg',
    images: [
      'uploads/ASUS/Keyboard/TUF-GAMING-K1/image_1.jpg',
      'uploads/ASUS/Keyboard/TUF-GAMING-K1/image_2.jpg',
      'uploads/ASUS/Keyboard/TUF-GAMING-K1/image_3.jpg',
      'uploads/ASUS/Keyboard/TUF-GAMING-K1/image_4.jpg',
      'uploads/ASUS/Keyboard/TUF-GAMING-K1/image_5.jpg'
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
    description: 'ASUS TUF Gaming K3 mechanical keyboard offers full-size layout, customizable RGB, and robust build for everyday gaming.',
    price: 0,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/TUF-GAMING-K3/image_1.jpg',
    images: [
      'uploads/ASUS/Keyboard/TUF-GAMING-K3/image_1.jpg',
      'uploads/ASUS/Keyboard/TUF-GAMING-K3/image_2.jpg',
      'uploads/ASUS/Keyboard/TUF-GAMING-K3/image_3.jpg',
      'uploads/ASUS/Keyboard/TUF-GAMING-K3/image_4.jpg',
      'uploads/ASUS/Keyboard/TUF-GAMING-K3/image_5.jpg'
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
    description: 'ASUS ROG Strix Scope II RX keyboard with optical mechanical switches and per-key RGB for fast, responsive typing.',
    price: 0,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/STRIXSCOPEII-RX-TW/image_1.jpg',
    images: [
      'uploads/ASUS/Keyboard/STRIXSCOPEII-RX-TW/image_1.jpg',
      'uploads/ASUS/Keyboard/STRIXSCOPEII-RX-TW/image_2.jpg'
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
    description: 'ASUS ROG Strix Scope NX Wireless keyboard features per-key RGB, mechanical switches, and wireless connectivity for flexible gaming.',
    price: 0,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/STRIX-SCOPE-NX-WL/image_1.jpg',
    images: [
      'uploads/ASUS/Keyboard/STRIX-SCOPE-NX-WL/image_1.jpg',
      'uploads/ASUS/Keyboard/STRIX-SCOPE-NX-WL/image_2.jpg',
      'uploads/ASUS/Keyboard/STRIX-SCOPE-NX-WL/image_3.jpg',
      'uploads/ASUS/Keyboard/STRIX-SCOPE-NX-WL/image_4.jpg'
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
    description: 'ASUS ROG Falchion RX compact 60% keyboard with low-profile switches, per-key RGB, and wireless support for portable gaming.',
    price: 0,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/M603-FALCHION-RX/image_1.png',
    images: [
      'uploads/ASUS/Keyboard/M603-FALCHION-RX/image_1.png',
      'uploads/ASUS/Keyboard/M603-FALCHION-RX/image2.png',
      'uploads/ASUS/Keyboard/M603-FALCHION-RX/image3.png',
      'uploads/ASUS/Keyboard/M603-FALCHION-RX/image4.png',
      'uploads/ASUS/Keyboard/M603-FALCHION-RX/image5.png',
      'uploads/ASUS/Keyboard/M603-FALCHION-RX/image6.png',
      'uploads/ASUS/Keyboard/M603-FALCHION-RX/image7.png',
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
    description: 'ASUS ROG Strix Scope RX TKL Wireless keyboard with optical mechanical switches, per-key RGB, and 80% layout for compact performance.',
    price: 0,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/STRIXSCOPE-RX-T-WL/image_1.jpg',
    images: [
      'uploads/ASUS/Keyboard/STRIXSCOPE-RX-T-WL/image_1.jpg',
      'uploads/ASUS/Keyboard/STRIXSCOPE-RX-T-WL/image_2.jpg',
      'uploads/ASUS/Keyboard/STRIXSCOPE-RX-T-WL/image_3.jpg',
      'uploads/ASUS/Keyboard/STRIXSCOPE-RX-T-WL/image_4.jpg'
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
    description: 'ASUS ROG Strix Scope TKL Moonlight keyboard offers TKL layout, detachable cable, and vibrant RGB for streamlined gaming setups.',
    price: 0,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/STRIX-SCOPE-TKL-ML/image_1.jpg',
    images: [
      'uploads/ASUS/Keyboard/STRIX-SCOPE-TKL-ML/image_1.jpg',
      'uploads/ASUS/Keyboard/STRIX-SCOPE-TKL-ML/image_2.jpg',
      'uploads/ASUS/Keyboard/STRIX-SCOPE-TKL-ML/image_3.jpg',
      'uploads/ASUS/Keyboard/STRIX-SCOPE-TKL-ML/image_4.jpg'
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
    description: 'ASUS ROG Strix Scope RX full-size keyboard with RX Red optical switches, per-key RGB, and USB passthrough for advanced gaming.',
    price: 13999,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/ROGSTRIX-SCOPE-RX/1.jpg',
    images: [
      'uploads/ASUS/Keyboard/ROGSTRIX-SCOPE-RX/1.jpg',
      'uploads/ASUS/Keyboard/ROGSTRIX-SCOPE-RX/2.jpg',
      'uploads/ASUS/Keyboard/ROGSTRIX-SCOPE-RX/3.jpg',
      'uploads/ASUS/Keyboard/ROGSTRIX-SCOPE-RX/4.jpg',
      'uploads/ASUS/Keyboard/ROGSTRIX-SCOPE-RX/5.jpg'
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
    description: 'ASUS ROG Azoth 75% keyboard with NX mechanical switches, all-key RGB, and premium build for enthusiast gamers.',
    price: 9999,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/M701-ROG-AZOTH/image1.png',
    images: [
      'uploads/ASUS/Keyboard/M701-ROG-AZOTH/image1.png',
      'uploads/ASUS/Keyboard/M701-ROG-AZOTH/image2.png',
      'uploads/ASUS/Keyboard/M701-ROG-AZOTH/image3.png',
      'uploads/ASUS/Keyboard/M701-ROG-AZOTH/image4.png',
      'uploads/ASUS/Keyboard/M701-ROG-AZOTH/image5.png',
      'uploads/ASUS/Keyboard/M701-ROG-AZOTH/image6.jpg',
      'uploads/ASUS/Keyboard/M701-ROG-AZOTH/image7.jpg',
      'uploads/ASUS/Keyboard/M701-ROG-AZOTH/image8.jpg',
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
    description: 'ASUS ROG Claymore II modular keyboard with RX Red optical switches, per-key RGB, and detachable numpad for ultimate flexibility.',
    price: 24999,
    brand: 'ASUS',
    image: 'uploads/ASUS/Keyboard/ROG-CLAYMORE-II/1.jpg',
    images: [
      'uploads/ASUS/Keyboard/ROG-CLAYMORE-II/1.jpg',
      'uploads/ASUS/Keyboard/ROG-CLAYMORE-II/2.jpg',
      'uploads/ASUS/Keyboard/ROG-CLAYMORE-II/3.jpg',
      'uploads/ASUS/Keyboard/ROG-CLAYMORE-II/4.jpg',
      'uploads/ASUS/Keyboard/ROG-CLAYMORE-II/5.jpg',
      'uploads/ASUS/Keyboard/ROG-CLAYMORE-II/6.jpg',
      'uploads/ASUS/Keyboard/ROG-CLAYMORE-II/7.jpg'
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
    // Find or create the Keyboard category
    let category = await Category.findOne({ name: 'Keyboard' });
    if (!category) {
      category = await Category.create({ 
        name: 'Keyboard', 
        description: 'Gaming and mechanical keyboards' 
      });
      console.log('Created Keyboard category');
    } else {
      console.log('Found existing Keyboard category');
    }

    // Update all products to use the category ID
    const productsWithCategory = products.map(product => ({
      ...product,
      category: category._id
    }));

    // Insert new products
    const result = await Product.insertMany(productsWithCategory);
    console.log(`Successfully seeded ${result.length} keyboard products`);

    // Close the connection
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding keyboard products:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeder
seedProducts(); 