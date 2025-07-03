import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { quotationsApi, Quotation } from '../../services/api';

const AdminQuotationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    quotationsApi.getById(id)
      .then((res: any) => {
        setQuotation(res?.data?.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load quotation details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!quotation) return <div className="p-8">No quotation found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Quotation Details</h2>
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <table className="min-w-full">
          <tbody>
            {Object.entries(quotation).map(([key, value]) => (
              <tr key={key}>
                <td className="font-semibold pr-4 py-2 align-top capitalize">{key}</td>
                <td className="py-2">
                  {Array.isArray(value) ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                  ) : typeof value === 'object' && value !== null ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                  ) : (
                    value?.toString()
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/admin/quotation" className="text-primary underline">Back to List</Link>
    </div>
  );
};

export default AdminQuotationDetails; 