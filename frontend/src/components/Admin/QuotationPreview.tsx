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
      className="max-w-3xl w-full mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-lg text-gray-900 font-sans"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-primary">Quotation</h2>
      <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
        <div className="space-y-1">
          <div><span className="font-semibold">Quote Owner:</span> {data.quoteOwner}</div>
          <div><span className="font-semibold">Subject:</span> {data.subject}</div>
          <div><span className="font-semibold">Stage:</span> {data.quoteStage}</div>
          <div><span className="font-semibold">Team:</span> {data.team}</div>
          <div><span className="font-semibold">Carrier:</span> {data.carrier}</div>
        </div>
        <div className="space-y-1">
          <div><span className="font-semibold">Deal Name:</span> {data.dealName}</div>
          <div><span className="font-semibold">Valid Until:</span> {data.validUntil}</div>
          <div><span className="font-semibold">Contact Name:</span> {data.contactName}</div>
          <div><span className="font-semibold">Account Name:</span> {data.accountName}</div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
        <div>
          <div className="font-semibold mb-1">Billing Address</div>
          <div>{data.billing.street}</div>
          <div>{data.billing.city}, {data.billing.state} {data.billing.code}</div>
          <div>{data.billing.country}</div>
        </div>
        <div>
          <div className="font-semibold mb-1">Shipping Address</div>
          <div>{data.shipping.street}</div>
          <div>{data.shipping.city}, {data.shipping.state} {data.shipping.code}</div>
          <div>{data.shipping.country}</div>
        </div>
      </div>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full border border-gray-200 rounded-lg text-xs sm:text-sm bg-gray-50">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2">S.NO</th>
              <th className="border px-2 py-2">Product Name</th>
              <th className="border px-2 py-2">Quantity</th>
              <th className="border px-2 py-2">List Price(Rs)</th>
              <th className="border px-2 py-2">Amount(Rs)</th>
              <th className="border px-2 py-2">Discount(Rs)</th>
              <th className="border px-2 py-2">Tax(Rs)</th>
              <th className="border px-2 py-2">Total(Rs)</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} className="bg-white hover:bg-gray-50 transition-all">
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1 min-w-[180px]">
                  <div className="font-semibold">{item.productName}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </td>
                <td className="border px-2 py-1 text-center">{item.quantity}</td>
                <td className="border px-2 py-1 text-right">{item.listPrice}</td>
                <td className="border px-2 py-1 text-right">{item.amount}</td>
                <td className="border px-2 py-1 text-right">{item.discount}</td>
                <td className="border px-2 py-1 text-right">{item.tax}</td>
                <td className="border px-2 py-1 text-right">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mb-8">
        <table className="min-w-[260px] text-sm">
          <tbody>
            <tr>
              <td className="py-1 pr-2 text-right font-semibold">Sub Total (Rs):</td>
              <td className="py-1 text-right">{data.subTotal}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2 text-right font-semibold">Discount (Rs):</td>
              <td className="py-1 text-right">{data.discount}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2 text-right font-semibold">Tax (Rs):</td>
              <td className="py-1 text-right">{data.tax}</td>
            </tr>
            <tr>
              <td className="py-1 pr-2 text-right font-semibold">Adjustment (Rs):</td>
              <td className="py-1 text-right">{data.adjustment}</td>
            </tr>
            <tr className="font-bold text-lg">
              <td className="py-2 pr-2 text-right">Grand Total (Rs):</td>
              <td className="py-2 text-right">{data.grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Terms and Conditions:</div>
        <div>{data.terms}</div>
      </div>
      <div>
        <div className="font-semibold">Description:</div>
        <div>{data.description}</div>
      </div>
    </div>
  );
};

export default QuotationPreview; 