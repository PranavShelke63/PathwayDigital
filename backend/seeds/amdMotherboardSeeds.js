const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://PranavAdmin:TwKdpH!dUf4QKFp@pathway.zos2qgp.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read Excel file
const wb = xlsx.readFile(path.join(__dirname, '../uploads/Copy of Asus MB, VGA, GAMING, MONITOR, ODD, PSU, CHASSIS, NUC ARP - APRIL2025 (1).xlsx'));
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// Find the start of AMD motherboards
const amdStartIdx = rows.findIndex(row => row && row.includes('AMD MOTHERBOARDS'));
const headerIdx = rows.findIndex(row => row && row.includes('Sr. No'));
const amdRows = rows.slice(headerIdx + 1, amdStartIdx + 50); // 49 products after the AMD header

// Get image paths for a product
function getImagePaths(productName) {
  const dir = path.join(__dirname, '../uploads/AsusProducts/AMD MOTHERBOARDS', productName);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .map(f => `uploads/AsusProducts/AMD MOTHERBOARDS/${productName}/${f}`);
}

const products = amdRows.map(row => {
  // Map columns to fields
  const [
    srNo, rashiPartNo, asusPartNo, socket, chipset, memory, maxRam, m2Support, display, audio, pcie, totalUsb, sata, lan, auraRgb, rgbHeader, wifi, formFactor, warranty, , mrp, arp
  ] = row;
  const name = asusPartNo || rashiPartNo;
  const imageDirName = (asusPartNo || rashiPartNo || '').replace(/\//g, '-').replace(/\s+/g, '').replace(/[^a-zA-Z0-9-_]/g, '');
  const images = getImagePaths(imageDirName);
  if (!images.length) {
    console.warn(`Skipping product '${name}' - no images found in AMD MOTHERBOARDS/${imageDirName}`);
    return null;
  }
  return {
    name: name,
    description: `${chipset} chipset, ${memory} slots, Max RAM: ${maxRam}GB, M.2: ${m2Support}, Display: ${display}, Audio: ${audio}, PCIe: ${pcie}, USB: ${totalUsb}, SATA: ${sata}, LAN: ${lan}, Aura RGB: ${auraRgb}, RGB Header: ${rgbHeader}, WiFi: ${wifi}, Form Factor: ${formFactor}`,
    price: arp || mrp || 0,
    category: 'ASUS MB 1&2',
    brand: 'ASUS',
    image: images[0],
    images: images,
    stock: 10,
    specifications: {
      rashiPartNo,
      asusPartNo,
      socket,
      chipset,
      memory,
      maxRam,
      m2Support,
      display,
      audio,
      pcie,
      totalUsb,
      sata,
      lan,
      auraRgb,
      rgbHeader,
      wifi,
      formFactor
    },
    warranty: warranty || '3Y'
  };
}).filter(Boolean);

// Function to seed the database
const seedProducts = async () => {
  try {
    // Delete existing AMD motherboards (optional: filter by category)
    await Product.deleteMany({ category: 'ASUS MB 1&2' });
    console.log('Deleted existing AMD motherboards');

    // Insert new products
    await Product.insertMany(products);
    console.log('Successfully seeded AMD motherboards');

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding AMD motherboards:', error);
    process.exit(1);
  }
};

// Run the seeder
seedProducts(); 