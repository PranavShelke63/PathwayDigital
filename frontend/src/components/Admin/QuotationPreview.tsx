import React from 'react';

interface QuotationPreviewProps {
  data: {
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
  };
}

const QuotationPreview: React.FC<QuotationPreviewProps> = ({ data }) => {
  return (
    <div
      id="quotation-preview"
      style={{
        width: 800,
        margin: '0 auto',
        background: '#fff',
        padding: 32,
        fontFamily: 'Arial, sans-serif',
        color: '#222',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Quotation</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div><strong>Quote Owner:</strong> {data.quoteOwner}</div>
          <div><strong>Subject:</strong> {data.subject}</div>
          <div><strong>Stage:</strong> {data.quoteStage}</div>
          <div><strong>Team:</strong> {data.team}</div>
          <div><strong>Carrier:</strong> {data.carrier}</div>
        </div>
        <div>
          <div><strong>Deal Name:</strong> {data.dealName}</div>
          <div><strong>Valid Until:</strong> {data.validUntil}</div>
          <div><strong>Contact Name:</strong> {data.contactName}</div>
          <div><strong>Account Name:</strong> {data.accountName}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <strong>Billing Address</strong>
          <div>{data.billing.street}</div>
          <div>{data.billing.city}, {data.billing.state} {data.billing.code}</div>
          <div>{data.billing.country}</div>
        </div>
        <div>
          <strong>Shipping Address</strong>
          <div>{data.shipping.street}</div>
          <div>{data.shipping.city}, {data.shipping.state} {data.shipping.code}</div>
          <div>{data.shipping.country}</div>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr style={{ background: '#f3f3f3' }}>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>S.NO</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Product Name</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Quantity</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>List Price($)</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Amount($)</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Discount($)</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Tax($)</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Total($)</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>
                <div style={{ fontWeight: 600 }}>{item.productName}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{item.description}</div>
              </td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{item.listPrice}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{item.amount}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{item.discount}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{item.tax}</td>
              <td style={{ border: '1px solid #ccc', padding: 8, textAlign: 'right' }}>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
        <table style={{ minWidth: 320 }}>
          <tbody>
            <tr>
              <td style={{ padding: 4, textAlign: 'right' }}>Sub Total ($):</td>
              <td style={{ padding: 4, textAlign: 'right' }}>{data.subTotal}</td>
            </tr>
            <tr>
              <td style={{ padding: 4, textAlign: 'right' }}>Discount ($):</td>
              <td style={{ padding: 4, textAlign: 'right' }}>{data.discount}</td>
            </tr>
            <tr>
              <td style={{ padding: 4, textAlign: 'right' }}>Tax ($):</td>
              <td style={{ padding: 4, textAlign: 'right' }}>{data.tax}</td>
            </tr>
            <tr>
              <td style={{ padding: 4, textAlign: 'right' }}>Adjustment ($):</td>
              <td style={{ padding: 4, textAlign: 'right' }}>{data.adjustment}</td>
            </tr>
            <tr style={{ fontWeight: 700 }}>
              <td style={{ padding: 4, textAlign: 'right' }}>Grand Total ($):</td>
              <td style={{ padding: 4, textAlign: 'right' }}>{data.grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Terms and Conditions:</strong>
        <div>{data.terms}</div>
      </div>
      <div>
        <strong>Description:</strong>
        <div>{data.description}</div>
      </div>
    </div>
  );
};

export default QuotationPreview; 