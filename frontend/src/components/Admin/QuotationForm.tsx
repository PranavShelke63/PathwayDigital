import React, { useState } from 'react';
import QuotationPreview from './QuotationPreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { quotationsApi } from '../../services/api';

interface QuotationFormProps {
  onClose: () => void;
}

interface QuotationFormState {
  quoteOwner: string;
  subject: string;
  quoteStage: string;
  team: string;
  carrier: string;
  dealName: string;
  validUntil: string;
  contactName: string;
  accountName: string;
  billing: { street: string; city: string; state: string; code: string; country: string };
  shipping: { street: string; city: string; state: string; code: string; country: string };
  items: Array<{
    productName: string;
    description: string;
    quantity: string;
    listPrice: string;
    amount: string;
    discount: string;
    tax: string;
    total: string;
  }>;
  terms: string;
  description: string;
  subTotal: string;
  discount: string;
  tax: string;
  adjustment: string;
  grandTotal: string;
  [key: string]: any; // <-- Add index signature for dynamic key access
}

interface ErrorsState {
  [key: string]: any;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ onClose }) => {
  // State for form fields (simplified for brevity)
  const [form, setForm] = useState<QuotationFormState>({
    quoteOwner: '', subject: '', quoteStage: 'Draft', team: '', carrier: 'FedEX',
    dealName: '', validUntil: '', contactName: '', accountName: '',
    billing: { street: '', city: '', state: '', code: '', country: '' },
    shipping: { street: '', city: '', state: '', code: '', country: '' },
    items: [{ productName: '', description: '', quantity: '', listPrice: '', amount: '', discount: '', tax: '', total: '' }],
    terms: '', description: '',
    subTotal: '', discount: '', tax: '', adjustment: '', grandTotal: '',
  });
  const [errors, setErrors] = useState<ErrorsState>({});
  const [showPreview, setShowPreview] = useState(false);

  // Helper to check if a value is a valid number
  const isNumber = (val: string) => val === '' || /^-?\d*\.?\d*$/.test(val);

  // Calculate item amount and total
  const calculateItem = (item: any) => {
    const quantity = parseFloat(item.quantity) || 0;
    const listPrice = parseFloat(item.listPrice) || 0;
    const discount = parseFloat(item.discount) || 0;
    const tax = parseFloat(item.tax) || 0;
    const amount = quantity * listPrice;
    const total = amount - discount + tax;
    return { amount: amount ? amount.toFixed(2) : '', total: total ? total.toFixed(2) : '' };
  };

  // Calculate subTotal, grandTotal, etc.
  const subTotal = form.items.reduce((sum, item) => {
    const { amount } = calculateItem(item);
    return sum + (parseFloat(amount) || 0);
  }, 0);
  const discount = parseFloat(form.discount) || 0;
  const tax = parseFloat(form.tax) || 0;
  const adjustment = parseFloat(form.adjustment) || 0;
  const grandTotal = subTotal - discount + tax + adjustment;

  // Validation
  const validateField = (name: string, value: string) => {
    if (['quantity', 'listPrice', 'amount', 'discount', 'tax', 'total', 'subTotal', 'adjustment', 'grandTotal'].includes(name)) {
      if (value && !isNumber(value)) {
        return 'Must be a number';
      }
    }
    return '';
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section?: string,
    idx?: number
  ) => {
    const { name, value } = e.target;
    let newForm = { ...form };
    let newErrors = { ...errors };
    if (section === 'billing' || section === 'shipping') {
      newForm[section] = { ...form[section], [name]: value };
    } else if (section === 'items' && typeof idx === 'number') {
      const items = [...form.items];
      items[idx] = { ...items[idx], [name]: value };
      // Auto-calculate amount and total
      const { amount, total } = calculateItem(items[idx]);
      items[idx].amount = amount;
      items[idx].total = total;
      newForm.items = items;
      // Validate number fields
      newErrors.items = newErrors.items || [];
      newErrors.items[idx] = newErrors.items[idx] || {};
      newErrors.items[idx][name] = validateField(name, value);
    } else {
      newForm[name] = value;
      newErrors[name] = validateField(name, value);
    }
    setForm(newForm);
    setErrors(newErrors);
  };

  const addRow = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        { productName: '', description: '', quantity: '', listPrice: '', amount: '', discount: '', tax: '', total: '' },
      ],
    });
  };

  const deleteRow = (idx: number) => {
    if (form.items.length === 1) return;
    const items = form.items.filter((_, i) => i !== idx);
    setForm({ ...form, items });
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById('quotation-preview');
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save('quotation.pdf');
  };

  // On submit, validate all number fields
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: any = {};
    form.items.forEach((item, idx) => {
      Object.entries(item).forEach(([key, value]) => {
        if (['quantity', 'listPrice', 'amount', 'discount', 'tax', 'total'].includes(key)) {
          if (value && !isNumber(value)) {
            newErrors.items = newErrors.items || [];
            newErrors.items[idx] = newErrors.items[idx] || {};
            newErrors.items[idx][key] = 'Must be a number';
          }
        }
      });
    });
    ['discount', 'tax', 'adjustment'].forEach((key) => {
      if (form[key] && !isNumber(form[key])) {
        newErrors[key] = 'Must be a number';
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Prepare payload for API
      const payload = {
        // Backend model fields
        quoteOwner: form.quoteOwner,
        subject: form.subject,
        quoteStage: form.quoteStage,
        team: form.team,
        carrier: form.carrier,
        dealName: form.dealName,
        validUntil: form.validUntil,
        contactName: form.contactName,
        accountName: form.accountName,
        billing: form.billing,
        shipping: form.shipping,
        items: form.items.map(item => ({
          description: item.description,
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.listPrice) || 0,
          total: Number(item.total) || 0,
        })),
        terms: form.terms,
        description: form.description,
        subTotal: form.subTotal,
        discount: form.discount,
        tax: form.tax,
        adjustment: form.adjustment,
        grandTotal: form.grandTotal,
        // Quotation interface fields
        customerName: form.contactName || form.accountName || '',
        customerPhone: '', // Add if available in form
        customerEmail: '', // Add if available in form
        subtotal: Number(form.subTotal) || 0,
        taxes: Number(form.tax) || 0,
        totalAmount: Number(form.grandTotal) || 0,
        status: "pending" as import('../../services/api').Quotation["status"],
        notes: form.terms || '',
      };
      try {
        await quotationsApi.create(payload);
        alert('Quotation submitted and stored!');
        onClose();
      } catch (err) {
        console.error('Failed to store quotation:', err);
        alert('Failed to store quotation. Please try again.');
      }
    }
  };

  return (
    <>
      {/* PDF Preview Modal */}
      {showPreview && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
            <button
              style={{ position: 'absolute', top: 12, right: 12, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setShowPreview(false)}
              title="Close"
            >✕</button>
            <QuotationPreview data={{ ...form, subTotal: subTotal.toFixed(2), grandTotal: grandTotal.toFixed(2) }} />
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button className="btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
            </div>
          </div>
        </div>
      )}
      <form
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-10 mt-8 mb-8 border border-gray-200"
        style={{ minWidth: 320 }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Quotation Bill</h2>
        {/* Quote Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Quote Information</h3>
            <div className="space-y-2">
              <input className="input" placeholder="Quote Owner" name="quoteOwner" value={form.quoteOwner} onChange={handleChange} />
              <input className="input" placeholder="Subject" name="subject" value={form.subject} onChange={handleChange} />
              <select className="input" name="quoteStage" value={form.quoteStage} onChange={handleChange}>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
              </select>
              <input className="input" placeholder="Team" name="team" value={form.team} onChange={handleChange} />
              <input className="input" placeholder="Carrier" name="carrier" value={form.carrier} onChange={handleChange} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">&nbsp;</h3>
            <div className="space-y-2">
              <input className="input" placeholder="Deal Name" name="dealName" value={form.dealName} onChange={handleChange} />
              <input className="input" placeholder="Valid Until" name="validUntil" value={form.validUntil} onChange={handleChange} />
              <input className="input" placeholder="Contact Name" name="contactName" value={form.contactName} onChange={handleChange} />
              <input className="input" placeholder="Account Name" name="accountName" value={form.accountName} onChange={handleChange} />
            </div>
          </div>
        </div>
        {/* Address Information */}
        <div>
          <h3 className="font-semibold mb-2">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <input className="input" placeholder="Billing Street" name="street" value={form.billing.street} onChange={e => handleChange(e, 'billing')} />
              <input className="input" placeholder="Billing City" name="city" value={form.billing.city} onChange={e => handleChange(e, 'billing')} />
              <input className="input" placeholder="Billing State" name="state" value={form.billing.state} onChange={e => handleChange(e, 'billing')} />
              <input className="input" placeholder="Billing Code" name="code" value={form.billing.code} onChange={e => handleChange(e, 'billing')} />
              <input className="input" placeholder="Billing Country" name="country" value={form.billing.country} onChange={e => handleChange(e, 'billing')} />
            </div>
            <div className="space-y-2">
              <input className="input" placeholder="Shipping Street" name="street" value={form.shipping.street} onChange={e => handleChange(e, 'shipping')} />
              <input className="input" placeholder="Shipping City" name="city" value={form.shipping.city} onChange={e => handleChange(e, 'shipping')} />
              <input className="input" placeholder="Shipping State" name="state" value={form.shipping.state} onChange={e => handleChange(e, 'shipping')} />
              <input className="input" placeholder="Shipping Code" name="code" value={form.shipping.code} onChange={e => handleChange(e, 'shipping')} />
              <input className="input" placeholder="Shipping Country" name="country" value={form.shipping.country} onChange={e => handleChange(e, 'shipping')} />
            </div>
          </div>
        </div>
        {/* Quoted Items */}
        <div>
          <h3 className="font-semibold mb-2">Quoted Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-gray-50">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2">S.NO</th>
                  <th className="border px-2 py-2">Product Name</th>
                  <th className="border px-2 py-2">Quantity</th>
                  <th className="border px-2 py-2">List Price($)</th>
                  <th className="border px-2 py-2">Amount($)</th>
                  <th className="border px-2 py-2">Discount($)</th>
                  <th className="border px-2 py-2">Tax($)</th>
                  <th className="border px-2 py-2">Total($)</th>
                  <th className="border px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((item, idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-50 transition-all">
                    <td className="border px-2 py-1 text-center">{idx + 1}</td>
                    <td className="border px-2 py-1 min-w-[180px]">
                      <input className="input w-full mb-1" name="productName" placeholder="Product Name" value={item.productName} onChange={e => handleChange(e, 'items', idx)} />
                      <textarea className="input w-full" name="description" placeholder="Description" value={item.description} onChange={e => handleChange(e, 'items', idx)} />
                    </td>
                    <td className="border px-2 py-1">
                      <input className="input w-20" name="quantity" value={item.quantity} onChange={e => handleChange(e, 'items', idx)} />
                      {errors.items && errors.items[idx] && errors.items[idx].quantity && (
                        <div className="text-red-500 text-xs">{errors.items[idx].quantity}</div>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      <input className="input w-24" name="listPrice" value={item.listPrice} onChange={e => handleChange(e, 'items', idx)} />
                      {errors.items && errors.items[idx] && errors.items[idx].listPrice && (
                        <div className="text-red-500 text-xs">{errors.items[idx].listPrice}</div>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      <input className="input w-24 bg-gray-100" name="amount" value={calculateItem(item).amount} readOnly />
                    </td>
                    <td className="border px-2 py-1">
                      <input className="input w-20" name="discount" value={item.discount} onChange={e => handleChange(e, 'items', idx)} />
                      {errors.items && errors.items[idx] && errors.items[idx].discount && (
                        <div className="text-red-500 text-xs">{errors.items[idx].discount}</div>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      <input className="input w-20" name="tax" value={item.tax} onChange={e => handleChange(e, 'items', idx)} />
                      {errors.items && errors.items[idx] && errors.items[idx].tax && (
                        <div className="text-red-500 text-xs">{errors.items[idx].tax}</div>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      <input className="input w-24 bg-gray-100" name="total" value={calculateItem(item).total} readOnly />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        type="button"
                        className={`btn-danger px-2 py-1 rounded ${form.items.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => deleteRow(idx)}
                        disabled={form.items.length === 1}
                        title={form.items.length === 1 ? 'At least one item required' : 'Delete row'}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn-secondary mt-4" onClick={addRow}>+ Add row</button>
          </div>
        </div>
        {/* Totals and Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block font-semibold">Terms and Conditions</label>
            <input className="input" name="terms" value={form.terms} onChange={handleChange} />
            <label className="block font-semibold">Description</label>
            <textarea className="input" name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Sub Total ($)</label>
            <input className="input bg-gray-100" name="subTotal" value={subTotal.toFixed(2)} readOnly />
            <label className="block font-semibold">Discount ($)</label>
            <input className="input" name="discount" value={form.discount} onChange={handleChange} />
            {errors.discount && <div className="text-red-500 text-xs">{errors.discount}</div>}
            <label className="block font-semibold">Tax ($)</label>
            <input className="input" name="tax" value={form.tax} onChange={handleChange} />
            {errors.tax && <div className="text-red-500 text-xs">{errors.tax}</div>}
            <label className="block font-semibold">Adjustment ($)</label>
            <input className="input" name="adjustment" value={form.adjustment} onChange={handleChange} />
            {errors.adjustment && <div className="text-red-500 text-xs">{errors.adjustment}</div>}
            <label className="block font-semibold">Grand Total ($)</label>
            <input className="input bg-gray-100" name="grandTotal" value={grandTotal.toFixed(2)} readOnly />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-secondary" onClick={() => setShowPreview(true)}>Preview PDF</button>
          <button type="submit" className="btn-primary">Create Quotation</button>
        </div>
      </form>
    </>
  );
};

export default QuotationForm; 