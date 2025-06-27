const mongoose = require('mongoose');

const RepairJobSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  deviceType: { type: String, required: true },
  deviceBrand: { type: String, required: true },
  deviceModel: { type: String, required: true },
  deviceSerial: { type: String, required: true },
  problemDescription: { type: String, required: true },
  dropOffDate: { type: Date, required: true },
  expectedDeliveryDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  partsUsed: [{
    partName: String,
    partCost: Number
  }],
  laborCharges: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  physicalConditionImages: {
    type: [String],
    validate: [arr => arr.length <= 8, 'Maximum 8 images allowed']
  },
  physicalConditionDescription: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('RepairJob', RepairJobSchema); 