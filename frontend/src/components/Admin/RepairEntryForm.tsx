import React, { useState, useEffect } from 'react';
import { repairsApi, RepairJob, PartUsed } from '../../services/api';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

const initialJob: Omit<RepairJob, '_id' | 'createdAt' | 'updatedAt'> = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  deviceType: '',
  deviceBrand: '',
  deviceModel: '',
  deviceSerial: '',
  problemDescription: '',
  dropOffDate: '',
  expectedDeliveryDate: '',
  status: 'pending',
  partsUsed: [],
  laborCharges: 0,
  taxes: 0,
  totalAmount: 0,
  paymentStatus: 'unpaid',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  physicalConditionImages: [],
  physicalConditionDescription: '',
};

const initialErrors = {
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  deviceType: '',
  deviceBrand: '',
  deviceModel: '',
  deviceSerial: '',
  problemDescription: '',
  dropOffDate: '',
  expectedDeliveryDate: '',
  laborCharges: '',
  taxes: '',
  partName: '',
  partCost: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  physicalConditionImages: '',
  physicalConditionDescription: '',
};

const RepairEntryForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [job, setJob] = useState(initialJob);
  const [part, setPart] = useState<PartUsed>({ partName: '', partCost: 0 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState(initialErrors);
  const [physicalConditionFiles, setPhysicalConditionFiles] = useState<File[]>([]);

  useEffect(() => {
    if (isEdit && typeof id === 'string') {
      setLoading(true);
      repairsApi.getById(id)
        .then((res: { data: { data: RepairJob } }) => {
          const data = res.data.data;
          setJob({
            ...initialJob,
            ...data,
            dropOffDate: data.dropOffDate ? data.dropOffDate.slice(0, 10) : '',
            expectedDeliveryDate: data.expectedDeliveryDate ? data.expectedDeliveryDate.slice(0, 10) : '',
          });
        })
        .catch(() => setError('Failed to load repair job'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const validate = () => {
    const newErrors = { ...initialErrors };
    if (!job.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!job.customerPhone.trim()) newErrors.customerPhone = 'Phone number is required';
    else if (!/^\d{10}$/.test(job.customerPhone.trim())) newErrors.customerPhone = 'Enter a valid 10-digit Indian phone number';
    if (!job.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    else if (!/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(job.customerEmail.trim())) newErrors.customerEmail = 'Enter a valid email address';
    if (!job.deviceType.trim()) newErrors.deviceType = 'Device type is required';
    if (!job.deviceBrand.trim()) newErrors.deviceBrand = 'Device brand is required';
    if (!job.deviceModel.trim()) newErrors.deviceModel = 'Device model is required';
    if (!job.deviceSerial.trim()) newErrors.deviceSerial = 'Device serial is required';
    if (!job.problemDescription.trim()) newErrors.problemDescription = 'Problem description is required';
    if (!job.dropOffDate) newErrors.dropOffDate = 'Drop-off date is required';
    if (!job.expectedDeliveryDate) newErrors.expectedDeliveryDate = 'Expected delivery date is required';
    if (Number(job.laborCharges) < 0) newErrors.laborCharges = 'Labor charges cannot be negative';
    if (Number(job.taxes) < 0) newErrors.taxes = 'Taxes cannot be negative';
    if (!job.address.street.trim()) newErrors.street = 'Street is required';
    if (!job.address.city.trim()) newErrors.city = 'City is required';
    if (!job.address.state.trim()) newErrors.state = 'State is required';
    if (!job.address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!job.address.country.trim()) newErrors.country = 'Country is required';
    if (physicalConditionFiles.length > 8) newErrors.physicalConditionImages = 'Maximum 8 images allowed';
    if (!job.physicalConditionDescription.trim()) newErrors.physicalConditionDescription = 'Description is required';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPart((prev) => ({ ...prev, [name]: name === 'partCost' ? Number(value) : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const addPart = () => {
    let partErr = { partName: '', partCost: '' };
    if (!part.partName.trim()) partErr.partName = 'Part name is required';
    if (!part.partCost || part.partCost <= 0) partErr.partCost = 'Cost must be greater than 0';
    setErrors((prev) => ({ ...prev, ...partErr }));
    if (partErr.partName || partErr.partCost) return;
    setJob((prev) => ({ ...prev, partsUsed: [...prev.partsUsed, part] }));
    setPart({ partName: '', partCost: 0 });
  };

  const removePart = (idx: number) => {
    setJob((prev) => ({ ...prev, partsUsed: prev.partsUsed.filter((_, i) => i !== idx) }));
  };

  const calculateTotal = () => {
    const partsTotal = job.partsUsed.reduce((sum, p) => sum + p.partCost, 0);
    return partsTotal + Number(job.laborCharges) + Number(job.taxes);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files);
    if (physicalConditionFiles.length + fileArr.length > 8) {
      setErrors((prev) => ({ ...prev, physicalConditionImages: 'Maximum 8 images allowed' }));
      return;
    }
    setPhysicalConditionFiles((prev) => [...prev, ...fileArr]);
    setErrors((prev) => ({ ...prev, physicalConditionImages: '' }));
  };

  const removeImage = (idx: number) => {
    setPhysicalConditionFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const validation = validate();
    setErrors(validation);
    const hasError = Object.values(validation).some((v) => v);
    if (hasError) return;
    setLoading(true);
    try {
      let imageUrls: string[] = [];
      if (physicalConditionFiles.length > 0) {
        let uploadRes;
        if (isEdit && typeof id === 'string') {
          uploadRes = await repairsApi.uploadConditionImages(physicalConditionFiles, id);
        } else {
          console.log('Uploading images with customerName:', job.customerName);
          uploadRes = await repairsApi.uploadConditionImages(physicalConditionFiles, undefined, job.customerName);
        }
        imageUrls = uploadRes.data.urls;
      }
      const totalAmount = calculateTotal();
      const jobData = {
        ...job,
        totalAmount,
        physicalConditionImages: imageUrls,
      };
      if (isEdit && typeof id === 'string') {
        await repairsApi.update(id, jobData);
        setSuccess(true);
        setTimeout(() => navigate('/admin/repairs'), 1000);
      } else {
        await repairsApi.create(jobData);
        setSuccess(true);
        setJob(initialJob);
        setErrors(initialErrors);
        setPhysicalConditionFiles([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-contrast text-center">{isEdit ? 'Edit Repair Entry' : 'New Repair Entry'}</h2>
      {success && <div className="mb-4 text-green-600" aria-live="polite">{isEdit ? 'Repair job updated successfully!' : 'Repair job submitted successfully!'}</div>}
      {error && <div className="mb-4 text-red-600" aria-live="polite">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="label">Customer Name<span className="text-red-500">*</span></label>
              <input id="customerName" name="customerName" value={job.customerName} onChange={handleChange} className={`input${errors.customerName ? ' input-error' : ''}`} />
              {errors.customerName && <p className="error">{errors.customerName}</p>}
            </div>
            <div>
              <label htmlFor="customerPhone" className="label">Phone Number<span className="text-red-500">*</span></label>
              <input id="customerPhone" name="customerPhone" value={job.customerPhone} onChange={handleChange} className={`input${errors.customerPhone ? ' input-error' : ''}`} maxLength={10} />
              {errors.customerPhone && <p className="error">{errors.customerPhone}</p>}
            </div>
            <div>
              <label htmlFor="customerEmail" className="label">Email<span className="text-red-500">*</span></label>
              <input id="customerEmail" name="customerEmail" value={job.customerEmail} onChange={handleChange} className={`input${errors.customerEmail ? ' input-error' : ''}`} type="email" />
              {errors.customerEmail && <p className="error">{errors.customerEmail}</p>}
            </div>
          </div>
        </div>
        {/* Address Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Customer Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="street" className="label">Street<span className="text-red-500">*</span></label>
              <input id="street" name="street" value={job.address.street} onChange={handleAddressChange} className={`input${errors.street ? ' input-error' : ''}`} />
              {errors.street && <p className="error">{errors.street}</p>}
            </div>
            <div>
              <label htmlFor="city" className="label">City<span className="text-red-500">*</span></label>
              <input id="city" name="city" value={job.address.city} onChange={handleAddressChange} className={`input${errors.city ? ' input-error' : ''}`} />
              {errors.city && <p className="error">{errors.city}</p>}
            </div>
            <div>
              <label htmlFor="state" className="label">State<span className="text-red-500">*</span></label>
              <input id="state" name="state" value={job.address.state} onChange={handleAddressChange} className={`input${errors.state ? ' input-error' : ''}`} />
              {errors.state && <p className="error">{errors.state}</p>}
            </div>
            <div>
              <label htmlFor="zipCode" className="label">ZIP Code<span className="text-red-500">*</span></label>
              <input id="zipCode" name="zipCode" value={job.address.zipCode} onChange={handleAddressChange} className={`input${errors.zipCode ? ' input-error' : ''}`} />
              {errors.zipCode && <p className="error">{errors.zipCode}</p>}
            </div>
            <div>
              <label htmlFor="country" className="label">Country<span className="text-red-500">*</span></label>
              <input id="country" name="country" value={job.address.country} onChange={handleAddressChange} className={`input${errors.country ? ' input-error' : ''}`} />
              {errors.country && <p className="error">{errors.country}</p>}
            </div>
          </div>
        </div>
        {/* Device Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Device Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deviceType" className="label">Device Type<span className="text-red-500">*</span></label>
              <input id="deviceType" name="deviceType" value={job.deviceType} onChange={handleChange} className={`input${errors.deviceType ? ' input-error' : ''}`} />
              {errors.deviceType && <p className="error">{errors.deviceType}</p>}
            </div>
            <div>
              <label htmlFor="deviceBrand" className="label">Brand<span className="text-red-500">*</span></label>
              <input id="deviceBrand" name="deviceBrand" value={job.deviceBrand} onChange={handleChange} className={`input${errors.deviceBrand ? ' input-error' : ''}`} />
              {errors.deviceBrand && <p className="error">{errors.deviceBrand}</p>}
            </div>
            <div>
              <label htmlFor="deviceModel" className="label">Model<span className="text-red-500">*</span></label>
              <input id="deviceModel" name="deviceModel" value={job.deviceModel} onChange={handleChange} className={`input${errors.deviceModel ? ' input-error' : ''}`} />
              {errors.deviceModel && <p className="error">{errors.deviceModel}</p>}
            </div>
            <div>
              <label htmlFor="deviceSerial" className="label">Serial Number<span className="text-red-500">*</span></label>
              <input id="deviceSerial" name="deviceSerial" value={job.deviceSerial} onChange={handleChange} className={`input${errors.deviceSerial ? ' input-error' : ''}`} />
              {errors.deviceSerial && <p className="error">{errors.deviceSerial}</p>}
            </div>
          </div>
        </div>
        {/* Repair Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Repair Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dropOffDate" className="label">Drop-off Date<span className="text-red-500">*</span></label>
              <input id="dropOffDate" name="dropOffDate" value={job.dropOffDate} onChange={handleChange} className={`input${errors.dropOffDate ? ' input-error' : ''}`} type="date" />
              {errors.dropOffDate && <p className="error">{errors.dropOffDate}</p>}
            </div>
            <div>
              <label htmlFor="expectedDeliveryDate" className="label">Expected Delivery Date<span className="text-red-500">*</span></label>
              <input id="expectedDeliveryDate" name="expectedDeliveryDate" value={job.expectedDeliveryDate} onChange={handleChange} className={`input${errors.expectedDeliveryDate ? ' input-error' : ''}`} type="date" />
              {errors.expectedDeliveryDate && <p className="error">{errors.expectedDeliveryDate}</p>}
            </div>
            <div>
              <label htmlFor="status" className="label">Status</label>
              <select id="status" name="status" value={job.status} onChange={handleChange} className="input">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="paymentStatus" className="label">Payment Status</label>
              <select id="paymentStatus" name="paymentStatus" value={job.paymentStatus} onChange={handleChange} className="input">
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="problemDescription" className="label">Problem Description<span className="text-red-500">*</span></label>
            <textarea id="problemDescription" name="problemDescription" value={job.problemDescription} onChange={handleChange} className={`input${errors.problemDescription ? ' input-error' : ''}`} />
            {errors.problemDescription && <p className="error">{errors.problemDescription}</p>}
          </div>
        </div>
        {/* Parts Used */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Parts Used</h3>
          <div className="flex flex-col md:flex-row gap-2 mb-2 items-end">
            <div className="flex-1">
              <label htmlFor="partName" className="label">Part Name</label>
              <input id="partName" name="partName" value={part.partName} onChange={handlePartChange} placeholder="Part Name" className={`input w-full${errors.partName ? ' input-error' : ''}`} />
              {errors.partName && <p className="error">{errors.partName}</p>}
            </div>
            <div className="w-32">
              <label htmlFor="partCost" className="label">Cost (₹)</label>
              <input id="partCost" name="partCost" value={part.partCost} onChange={handlePartChange} placeholder="Cost (₹)" className={`input w-full${errors.partCost ? ' input-error' : ''}`} type="number" min="0" />
              {errors.partCost && <p className="error">{errors.partCost}</p>}
            </div>
            <button type="button" onClick={addPart} className="btn-primary flex items-center gap-1 px-3 py-2 mt-2 md:mt-0">
              <FaPlus className="text-xs" /> Add
            </button>
          </div>
          <ul className="divide-y divide-gray-200">
            {job.partsUsed.map((p, idx) => (
              <li key={idx} className="flex items-center justify-between py-2">
                <span>{p.partName} <span className="text-gray-500">(₹{p.partCost})</span></span>
                <button type="button" onClick={() => removePart(idx)} className="text-red-500 hover:text-red-700 p-1" title="Remove">
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Physical Condition Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Physical Condition (Before Repair)</h3>
          <div className="mb-2">
            <label className="label">Upload Images (max 8)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="input" />
            {errors.physicalConditionImages && <p className="error">{errors.physicalConditionImages}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {physicalConditionFiles.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden flex items-center justify-center bg-gray-50">
                    <img src={url} alt={`Physical Condition ${idx + 1}`} className="object-contain w-full h-full" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1" title="Remove"><FaTrash /></button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="physicalConditionDescription" className="label">Physical Condition Description<span className="text-red-500">*</span></label>
            <textarea id="physicalConditionDescription" name="physicalConditionDescription" value={job.physicalConditionDescription} onChange={e => setJob(prev => ({ ...prev, physicalConditionDescription: e.target.value }))} className={`input${errors.physicalConditionDescription ? ' input-error' : ''}`} />
            {errors.physicalConditionDescription && <p className="error">{errors.physicalConditionDescription}</p>}
          </div>
        </div>
        {/* Payment Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="laborCharges" className="label">Labour Charges (₹)</label>
              <input id="laborCharges" name="laborCharges" value={job.laborCharges} onChange={handleChange} className={`input${errors.laborCharges ? ' input-error' : ''}`} type="number" min="0" />
              {errors.laborCharges && <p className="error">{errors.laborCharges}</p>}
            </div>
            <div>
              <label htmlFor="taxes" className="label">Taxes (₹)</label>
              <input id="taxes" name="taxes" value={job.taxes} onChange={handleChange} className={`input${errors.taxes ? ' input-error' : ''}`} type="number" min="0" />
              {errors.taxes && <p className="error">{errors.taxes}</p>}
            </div>
            <div>
              <label className="label">Total Amount (₹)</label>
              <input value={calculateTotal()} readOnly className="input bg-gray-100" />
            </div>
          </div>
        </div>
        <div className="pt-2">
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-lg font-semibold py-3" disabled={loading}>
            {loading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>}
            {loading ? (isEdit ? 'Updating...' : 'Submitting...') : (isEdit ? 'Update Repair Job' : 'Submit Repair Job')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RepairEntryForm; 