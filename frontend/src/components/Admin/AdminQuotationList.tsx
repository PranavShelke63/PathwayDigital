import React, { useEffect, useState } from 'react';
import { quotationsApi, Quotation } from '../../services/api';
import { Link } from 'react-router-dom';
import QuotationPreview from './QuotationPreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Extend Quotation type to match backend fields
interface BackendQuotation {
  _id?: string;
  quoteOwner: string;
  grandTotal: string;
  quoteStage: string;
  subject: string;
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
  createdAt?: string;
}

// Helper to render address fields nicely
function renderAddress(address: any) {
  if (
    address &&
    typeof address === 'object' &&
    ('street' in address || 'city' in address || 'state' in address || 'country' in address)
  ) {
    return (
      <div className="space-y-1">
        {address.street && <div><span className="font-semibold">Street:</span> {address.street}</div>}
        {address.city && <div><span className="font-semibold">City:</span> {address.city}</div>}
        {address.state && <div><span className="font-semibold">State:</span> {address.state}</div>}
        {address.code && <div><span className="font-semibold">Code:</span> {address.code}</div>}
        {address.country && <div><span className="font-semibold">Country:</span> {address.country}</div>}
      </div>
    );
  }
  return null;
}

// Helper to render items array as a table
function renderItems(items: any[]) {
  if (
    Array.isArray(items) &&
    items.length > 0 &&
    typeof items[0] === 'object' &&
    ('description' in items[0] || 'quantity' in items[0] || 'total' in items[0])
  ) {
    // Exclude _id and id columns
    const columns = Object.keys(items[0]).filter(key => key !== '_id' && key.toLowerCase() !== 'id');
    return (
      <table className="min-w-full text-xs border border-gray-200 rounded">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((key) => (
              <th key={key} className="px-2 py-1 font-semibold text-left capitalize">{key.replace(/([A-Z])/g, ' $1')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item._id || item.id || idx} className="border-t">
              {columns.map((col, i) => (
                <td key={i} className="px-2 py-1">
                  {typeof item[col] === 'string' || typeof item[col] === 'number' || typeof item[col] === 'boolean'
                    ? item[col]
                    : JSON.stringify(item[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return null;
}

const getPreviewQuotation = (q: BackendQuotation): any => ({
  quoteOwner: q.quoteOwner || '',
  subject: q.subject || '',
  quoteStage: q.quoteStage || '',
  team: (q as any).team || '',
  carrier: (q as any).carrier || '',
  dealName: (q as any).dealName || '',
  validUntil: (q as any).validUntil || '',
  contactName: (q as any).contactName || '',
  accountName: (q as any).accountName || '',
  billing: (q as any).billing || { street: '', city: '', state: '', code: '', country: '' },
  shipping: (q as any).shipping || { street: '', city: '', state: '', code: '', country: '' },
  items: (q as any).items || [],
  terms: (q as any).terms || '',
  description: (q as any).description || '',
  subTotal: (q as any).subTotal || '',
  discount: (q as any).discount || '',
  tax: (q as any).tax || '',
  adjustment: (q as any).adjustment || '',
  grandTotal: q.grandTotal || '',
});

const AdminQuotationList: React.FC = () => {
  const [quotations, setQuotations] = useState<BackendQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuotationId, setExpandedQuotationId] = useState<string | null>(null);
  const [previewQuotation, setPreviewQuotation] = useState<BackendQuotation | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    quotationsApi.getAll().then((res: any) => {
      const quotationsArr = res?.data?.data?.quotations;
      console.log('Fetched quotations:', quotationsArr); // Log all fetched quotations
      setQuotations(Array.isArray(quotationsArr) ? quotationsArr as BackendQuotation[] : []);
      setLoading(false);
    });
  }, []);

  const handleToggleDetails = (id: string) => {
    setExpandedQuotationId(expandedQuotationId === id ? null : id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await quotationsApi.delete(id);
        setQuotations(prev => prev.filter(q => q._id !== id));
        if (expandedQuotationId === id) setExpandedQuotationId(null);
      } catch (error) {
        alert('Failed to delete quotation.');
      }
    }
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById('quotation-preview');
    if (!input || !previewQuotation) return;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    // Use quoteOwner and createdAt (or today) in filename
    const name = previewQuotation.quoteOwner ? previewQuotation.quoteOwner.replace(/\s+/g, '_') : 'Quotation';
    let date = 'unknown_date';
    if (previewQuotation.createdAt) {
      date = new Date(previewQuotation.createdAt).toISOString().slice(0, 10);
    } else {
      date = new Date().toISOString().slice(0, 10);
    }
    pdf.save(`Quotation_${name}_${date}.pdf`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="ml-3 text-primary text-lg">Loading quotations...</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">All Quotations</h2>
      <div className="bg-white shadow-lg rounded-xl overflow-x-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Sr No</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
                              <th className="px-4 py-3 text-left font-semibold">Total (₹)</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q, idx) => (
              <React.Fragment key={q._id}>
                <tr className="hover:bg-blue-50 transition-colors group">
                  <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{q.quoteOwner}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold text-green-700">{q.grandTotal ? `₹${q.grandTotal}` : '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap capitalize font-semibold text-blue-700">{q.quoteStage}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        className="text-primary underline hover:text-blue-700 focus:outline-none transition-colors font-semibold"
                        onClick={() => handleToggleDetails(q._id!)}
                        aria-label={expandedQuotationId === q._id ? 'Hide details' : 'View details'}
                        title={expandedQuotationId === q._id ? 'Hide details' : 'View details'}
                      >
                        {expandedQuotationId === q._id ? 'Hide' : 'View'}
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800 focus:outline-none p-1 rounded-full transition-colors bg-blue-50 hover:bg-blue-100"
                        onClick={() => { setPreviewQuotation(getPreviewQuotation(q)); setShowPreview(true); }}
                        aria-label="Download quotation"
                        title="Download quotation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                        </svg>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 focus:outline-none p-1 rounded-full transition-colors bg-red-50 hover:bg-red-100"
                        onClick={() => handleDelete(q._id!)}
                        aria-label="Delete quotation"
                        title="Delete quotation"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" />
                          <path fillRule="evenodd" d="M4 6a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm2 0v10h8V6H6zm2-3a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1H8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedQuotationId === q._id && (
                  <tr>
                    <td colSpan={6} className="bg-gray-50 px-2 sm:px-6 py-6">
                      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-primary">Quotation Details</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                          {Object.entries(q).map(([key, value]) => (
                            <React.Fragment key={key}>
                              <dt className="font-medium text-gray-700 capitalize truncate">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </dt>
                              <dd className="text-gray-900 break-all">
                                {(() => {
                                  if (key === 'items' && Array.isArray(value)) {
                                    return renderItems(value);
                                  } else if (typeof value === 'object' && value !== null && renderAddress(value)) {
                                    return renderAddress(value);
                                  } else if (Array.isArray(value)) {
                                    return <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>;
                                  } else if (typeof value === 'object' && value !== null) {
                                    return <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>;
                                  } else {
                                    return value?.toString() || '';
                                  }
                                })()}
                              </dd>
                            </React.Fragment>
                          ))}
                        </dl>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {quotations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-lg">
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showPreview && previewQuotation && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 24, maxHeight: '90vh', overflow: 'auto', position: 'relative' }}>
            <button
              style={{ position: 'absolute', top: 12, right: 12, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setShowPreview(false)}
              title="Close"
            >✕</button>
            <QuotationPreview data={previewQuotation} />
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <button className="btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotationList; 