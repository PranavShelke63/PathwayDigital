import React from 'react';
import { RepairJob } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import logo from '../../assets/bgLOGO.png';

interface InvoiceViewProps {
  job: RepairJob;
  onClose: () => void;
}



const InvoiceView: React.FC<InvoiceViewProps> = ({ job, onClose }) => {
  if (!job) return null;
  return (
    <div id="invoice-print-area" className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 print:static print:bg-white print:bg-opacity-100 print:flex print:items-start print:justify-center print:min-h-screen print:min-h-[100vh] print:w-full print:h-full">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-2xl relative flex flex-col print:w-full print:max-w-full print:rounded-none print:shadow-none print:p-12 print:m-0 print:h-full print:min-h-screen print:min-h-[100vh] border border-gray-300 print:border print:border-gray-400 overflow-y-auto max-h-[95vh] print:overflow-visible print:max-h-full">
        {/* Close and Print Buttons (top right, absolute, hidden on print) */}
        <div className="absolute top-2 right-2 flex gap-2 print:hidden z-20">
          <button className="btn-primary" onClick={() => window.print()}>Print</button>
          <button className="text-2xl" onClick={onClose}>&times;</button>
        </div>
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-2 print:mb-4">
          <img src={logo} alt="Pathway Digital Logo" className="h-14 w-auto mb-1 print:mb-1 print:h-12" style={{objectFit: 'contain', maxHeight: '188px'}} />
          
          <div className="text-xs text-gray-500">{new Date().toLocaleDateString()}</div>
        </div>
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-contrast mb-6 print:mb-4 border-b border-gray-200 pb-2">Repair Invoice</h2>
        {/* Customer & Device Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-6 print:mb-4">
          <div className="space-y-2 text-sm">
            <div><span className="font-semibold">Customer:</span> <span className="font-bold">{job.customerName}</span></div>
            <div><span className="font-semibold">Phone:</span> <span>{job.customerPhone}</span></div>
            <div><span className="font-semibold">Email:</span> <span>{job.customerEmail}</span></div>
            <div><span className="font-semibold">Address:</span> <span>{job.address?.street}, {job.address?.city}, {job.address?.state} {job.address?.zipCode}, {job.address?.country}</span></div>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="font-semibold">Device:</span> <span>{job.deviceType} - {job.deviceBrand} {job.deviceModel}</span></div>
            <div><span className="font-semibold">S/N:</span> <span>{job.deviceSerial}</span></div>
            <div><span className="font-semibold">Drop-off:</span> <span>{job.dropOffDate?.slice(0,10)}</span></div>
            <div><span className="font-semibold">Delivery:</span> <span>{job.expectedDeliveryDate?.slice(0,10)}</span></div>
            <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{job.status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span></div>
            <div><span className="font-semibold">Payment:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${job.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{job.paymentStatus.charAt(0).toUpperCase() + job.paymentStatus.slice(1)}</span></div>
          </div>
        </div>
        {/* Problem Description */}
        <div className="mb-6 print:mb-4">
          <h3 className="font-semibold text-base mb-1 text-contrast border-b border-gray-100 pb-1">Problem Description</h3>
          <div className="bg-gray-50 rounded p-2 text-xs md:text-sm print:bg-white print:p-0 print:rounded-none print:text-sm">{job.problemDescription}</div>
        </div>
        {/* Parts & Charges */}
        <div className="mb-6 print:mb-4">
          <h3 className="font-semibold text-base mb-1 text-contrast border-b border-gray-100 pb-1">Parts & Charges</h3>
          <div className="overflow-x-auto">
            <table className="w-full mb-2 text-xs md:text-sm border rounded overflow-hidden print:text-sm print:mb-1 print:border print:rounded-none">
              <thead>
                <tr className="bg-gray-100 print:bg-white">
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
          <div className="flex flex-wrap gap-8 justify-end text-xs md:text-sm mt-2 print:mt-0 print:gap-8">
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