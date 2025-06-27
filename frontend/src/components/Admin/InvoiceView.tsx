import React from 'react';
import { RepairJob } from '../../services/api';

interface InvoiceViewProps {
  job: RepairJob;
  onClose: () => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ job, onClose }) => {
  if (!job) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-2xl relative print:w-full print:max-w-full print:rounded-none print:shadow-none max-h-[95vh] overflow-y-auto">
        <button className="absolute top-2 right-2 text-2xl print:hidden z-10" onClick={onClose}>&times;</button>
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center border-b pb-3 gap-2">
          <h2 className="text-2xl md:text-3xl font-bold text-contrast">Repair Invoice</h2>
          <button className="btn-primary print:hidden w-full md:w-auto" onClick={() => window.print()}>Print</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4">
          <div>
            <div className="mb-2"><span className="font-semibold">Customer:</span><br />
              <span className="text-base md:text-lg font-bold">{job.customerName}</span><br />
              <span className="text-xs md:text-sm text-gray-600">{job.customerPhone}</span><br />
              <span className="text-xs md:text-sm text-gray-600">{job.customerEmail}</span>
            </div>
            <div className="mb-2"><span className="font-semibold">Address:</span><br />
              <span className="text-xs md:text-sm">{job.address?.street}</span><br />
              <span className="text-xs md:text-sm">{job.address?.city}, {job.address?.state} {job.address?.zipCode}</span><br />
              <span className="text-xs md:text-sm">{job.address?.country}</span>
            </div>
          </div>
          <div>
            <div className="mb-2"><span className="font-semibold">Device:</span><br />
              <span className="text-xs md:text-sm">{job.deviceType} - {job.deviceBrand} {job.deviceModel}</span><br />
              <span className="text-xs text-gray-500">S/N: {job.deviceSerial}</span>
            </div>
            <div className="mb-2"><span className="font-semibold">Drop-off:</span> {job.dropOffDate?.slice(0,10)}</div>
            <div className="mb-2"><span className="font-semibold">Delivery:</span> {job.expectedDeliveryDate?.slice(0,10)}</div>
            <div className="mb-2 flex flex-wrap gap-2 items-center">
              <span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{job.status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
              <span className="font-semibold ml-0 md:ml-4">Payment:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${job.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{job.paymentStatus.charAt(0).toUpperCase() + job.paymentStatus.slice(1)}</span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-base md:text-lg mb-1 text-contrast">Problem Description</h3>
          <div className="bg-gray-50 rounded p-2 text-xs md:text-sm">{job.problemDescription}</div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-base md:text-lg mb-1 text-contrast">Physical Condition (Before Repair)</h3>
          <div className="bg-gray-50 rounded p-2 text-xs md:text-sm mb-2">{job.physicalConditionDescription}</div>
          {job.physicalConditionImages && job.physicalConditionImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {job.physicalConditionImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Condition ${idx + 1}`}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover border cursor-pointer rounded shadow-sm"
                  onClick={() => window.open(img, '_blank')}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-base md:text-lg mb-1 text-contrast">Parts & Charges</h3>
          <div className="overflow-x-auto">
            <table className="w-full mb-2 text-xs md:text-sm border rounded overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-2 py-1">Part</th>
                  <th className="text-right px-2 py-1">Cost</th>
                </tr>
              </thead>
              <tbody>
                {job.partsUsed.length > 0 ? job.partsUsed.map((p, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1">{p.partName}</td>
                    <td className="px-2 py-1 text-right">₹{p.partCost}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={2} className="text-center py-2">No parts used</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-4 justify-end text-xs md:text-sm mt-2">
            <div><span className="font-semibold">Labor:</span> ₹{job.laborCharges}</div>
            <div><span className="font-semibold">Taxes:</span> ₹{job.taxes}</div>
            <div className="font-bold text-base md:text-lg"><span>Total:</span> ₹{job.totalAmount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView; 