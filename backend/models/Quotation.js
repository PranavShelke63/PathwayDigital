const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  quoteOwner: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  quoteStage: { type: String, required: true, trim: true },
  team: { type: String, trim: true },
  carrier: { type: String, trim: true },
  dealName: { type: String, trim: true },
  validUntil: { type: String, trim: true },
  contactName: { type: String, trim: true },
  accountName: { type: String, trim: true },
  billing: {
    street: String,
    city: String,
    state: String,
    code: String,
    country: String
  },
  shipping: {
    street: String,
    city: String,
    state: String,
    code: String,
    country: String
  },
  items: [
    {
      productName: String,
      description: String,
      quantity: String,
      listPrice: String,
      amount: String,
      discount: String,
      tax: String,
      total: String
    }
  ],
  terms: { type: String },
  description: { type: String },
  subTotal: { type: String },
  discount: { type: String },
  tax: { type: String },
  adjustment: { type: String },
  grandTotal: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation; 