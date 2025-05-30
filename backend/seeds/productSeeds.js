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
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
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
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
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
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
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
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1467&q=80',
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
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
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
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
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
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    stock: 20,
    specifications: {
      connectivity: ['USB-C', 'USB-A adapter included'],
      weight: '1.1 kg'
    },
    features: ['Per-key RGB', 'Cherry MX Red Switches', 'Aluminum Frame'],
    warranty: '2 Years Limited Warranty'
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