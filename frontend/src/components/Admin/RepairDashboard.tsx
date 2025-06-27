import React, { useEffect, useState } from 'react';
import { repairsApi, RepairJob } from '../../services/api';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'jspdf-autotable';
import InvoiceView from './InvoiceView';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  let color = 'bg-gray-200 text-gray-800';
  if (status === 'pending') color = 'bg-yellow-100 text-yellow-800';
  if (status === 'in-progress') color = 'bg-blue-100 text-blue-800';
  if (status === 'completed') color = 'bg-green-100 text-green-800';
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>;
}

function PaymentBadge({ payment }: { payment: string }) {
  let color = 'bg-gray-200 text-gray-800';
  if (payment === 'paid') color = 'bg-green-100 text-green-800';
  if (payment === 'unpaid') color = 'bg-red-100 text-red-800';
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{payment.charAt(0).toUpperCase() + payment.slice(1)}</span>;
}

const RepairDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    customerName: '',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState<RepairJob | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (filters.status) params.status = filters.status;
      if (filters.customerName) params.customerName = filters.customerName;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await repairsApi.getAll(params);
      setJobs(res.data.data);
    } catch (err: any) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleReset = () => {
    setFilters({ status: '', customerName: '', startDate: '', endDate: '' });
    setTimeout(fetchJobs, 0);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this repair job?')) return;
    try {
      await repairsApi.delete(id);
      fetchJobs();
    } catch {
      alert('Failed to delete');
    }
  };

  // PDF generation function


  return (
    <div className="max-w-7xl mx-auto p-2 md:p-6">
      <h2 className="text-2xl font-bold mb-4 text-contrast">Repair Jobs Dashboard</h2>
      <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm items-end">
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" name="status" value={filters.status} onChange={handleFilterChange} className="input">
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="customerName">Customer Name</label>
          <input id="customerName" name="customerName" value={filters.customerName} onChange={handleFilterChange} placeholder="Customer Name" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="startDate">Start Date</label>
          <input id="startDate" name="startDate" value={filters.startDate} onChange={handleFilterChange} type="date" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="endDate">End Date</label>
          <input id="endDate" name="endDate" value={filters.endDate} onChange={handleFilterChange} type="date" className="input" />
        </div>
        <button type="submit" className="btn-primary">Filter</button>
        <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 border">Job ID</th>
                <th className="px-2 py-2 border">Customer</th>
                <th className="px-2 py-2 border">Device</th>
                <th className="px-2 py-2 border">Status</th>
                <th className="px-2 py-2 border">Drop-off</th>
                <th className="px-2 py-2 border">Delivery</th>
                <th className="px-2 py-2 border">Total</th>
                <th className="px-2 py-2 border">Payment</th>
                <th className="px-2 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                  <td className="border px-2 py-2 text-xs font-mono">{job._id}</td>
                  <td className="border px-2 py-2">{job.customerName}</td>
                  <td className="border px-2 py-2">{job.deviceBrand} {job.deviceModel}</td>
                  <td className="border px-2 py-2"><StatusBadge status={job.status} /></td>
                  <td className="border px-2 py-2">{formatDate(job.dropOffDate)}</td>
                  <td className="border px-2 py-2">{formatDate(job.expectedDeliveryDate)}</td>
                  <td className="border px-2 py-2 font-semibold">{formatCurrency(job.totalAmount)}</td>
                  <td className="border px-2 py-2"><PaymentBadge payment={job.paymentStatus} /></td>
                  <td className="border px-2 py-2 flex gap-2 items-center">
                    <button className="btn-secondary btn-xs flex items-center gap-1" title="View" onClick={() => setSelectedJob(job)}><FaEye /></button>
                    <button className="btn-secondary btn-xs flex items-center gap-1" title="Edit" onClick={() => navigate(`/admin/repairs/edit/${job._id}`)}><FaEdit /></button>
                    <button className="btn-danger btn-xs flex items-center gap-1" title="Delete" onClick={() => handleDelete(job._id!)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan={9} className="text-center py-4">No jobs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for job details */}
      {selectedJob && (
        <InvoiceView job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default RepairDashboard; 