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
    name: 'Dell XPS 13',
    description: 'Premium ultrabook with InfinityEdge display and exceptional performance',
    price: 1299.99,
    category: 'laptops',
    brand: 'Dell',
    image: 'uploads/products/dell_xps_13.png',
    stock: 15,
    specifications: {
      processor: 'Intel Core i7-1165G7',
      ram: '16GB LPDDR4X',
      storage: '512GB NVMe SSD',
      graphics: 'Intel Iris Xe Graphics',
      display: '13.4" FHD+ (1920 x 1200) InfinityEdge',
      operatingSystem: 'Windows 11 Pro',
      connectivity: ['Wi-Fi 6', 'Bluetooth 5.1'],
      ports: ['2x Thunderbolt 4', '1x USB-C 3.2', 'SD card reader'],
      battery: '52WHr',
      dimensions: '296 x 199 x 14.8 mm',
      weight: '1.2 kg'
    },
    features: ['InfinityEdge Display', 'Fingerprint Reader', 'Backlit Keyboard'],
    warranty: '1 Year Premium Support'
  },
  {
    name: 'HP Pavilion Gaming Desktop',
    description: 'Powerful gaming desktop for immersive gaming experience',
    price: 999.99,
    category: 'desktops',
    brand: 'HP',
    image: 'uploads/products/hp_pavilion_gaming_desktop.jpg',
    stock: 10,
    specifications: {
      processor: 'AMD Ryzen 7 5700G',
      ram: '16GB DDR4',
      storage: '1TB NVMe SSD',
      graphics: 'NVIDIA GeForce RTX 3060',
      operatingSystem: 'Windows 11 Home',
      connectivity: ['Wi-Fi 6', 'Bluetooth 5.0', 'Ethernet'],
      ports: ['6x USB 3.0', '4x USB 2.0', 'HDMI', 'DisplayPort']
    },
    features: ['RGB Lighting', 'Tool-less Design', 'Enhanced Thermal Solution'],
    warranty: '2 Years Limited Warranty'
  },
  {
    name: 'ASUS ROG Swift PG279Q',
    description: '27-inch gaming monitor with G-SYNC technology',
    price: 699.99,
    category: 'monitors',
    brand: 'ASUS',
    image: 'uploads/products/asus_rog_swift_pg279q.jpg',
    stock: 8,
    specifications: {
      display: '27" WQHD (2560 x 1440) IPS',
      connectivity: ['HDMI', 'DisplayPort'],
      ports: ['2x USB 3.0', 'Audio Out'],
      dimensions: '619.7 x 362.96 x 65.98 mm',
      weight: '7 kg'
    },
    features: ['165Hz Refresh Rate', 'G-SYNC Technology', 'GamePlus Function'],
    warranty: '3 Years Warranty'
  },
  {
    name: 'Logitech MX Master 3',
    description: 'Advanced wireless mouse for productivity',
    price: 99.99,
    category: 'accessories',
    brand: 'Logitech',
    image: 'uploads/products/logitech_mx_master_3.jpg',
    stock: 25,
    specifications: {
      connectivity: ['Bluetooth', 'USB Wireless'],
      battery: 'Up to 70 days',
      weight: '141g'
    },
    features: ['Magspeed Scrolling', 'Flow Cross-Computer Control', 'App-Specific Customization'],
    warranty: '1 Year Limited Hardware Warranty'
  },
  {
    name: 'Ubiquiti UniFi Dream Machine Pro',
    description: 'Enterprise network security gateway and controller',
    price: 379.99,
    category: 'networking',
    brand: 'Ubiquiti',
    image: 'uploads/products/ubiquiti_unifi_dream_machine_pro.jpg',
    stock: 5,
    specifications: {
      processor: '1.7 GHz Quad-Core',
      ram: '4GB DDR4',
      storage: '128GB',
      ports: ['8x GbE LAN', '1x GbE WAN', '1x SFP+ LAN', '1x SFP+ WAN']
    },
    features: ['IDS/IPS', 'Network Controller', 'Protect Server'],
    warranty: '1 Year Limited Warranty'
  },
  {
    name: 'RTX 4080 Graphics Card',
    description: 'High-end graphics card for gaming and content creation',
    price: 799.99,
    category: 'components',
    brand: 'NVIDIA',
    image: 'uploads/products/rtx_4080_graphics_card.jpg',
    stock: 7,
    specifications: {
      graphics: 'NVIDIA RTX 4080',
      memory: '16GB GDDR6X',
      ports: ['3x DisplayPort', '1x HDMI']
    },
    features: ['DLSS 3.0', 'Ray Tracing', '4K Gaming'],
    warranty: '3 Years Limited Warranty'
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    price: 129.99,
    category: 'accessories',
    brand: 'Corsair',
    image: 'uploads/products/mechanical_gaming_keyboard.jpg',
    stock: 20,
    specifications: {
      connectivity: ['USB-C', 'USB-A adapter included'],
      weight: '1.1 kg'
    },
    features: ['Per-key RGB', 'Cherry MX Red Switches', 'Aluminum Frame'],
    warranty: '2 Years Limited Warranty'
  }
];

// --- Added for image download script ---
const imageDownloads = products.map((product, idx) => ({
  url: product.image.replace(/w=\d+/, 'w=300'),
  filename: `backend/uploads/products/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.jpg`
}));

module.exports.imageDownloads = imageDownloads;

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