import React, { useEffect, useState } from 'react';
import { quotationsApi, Quotation } from '../services/api';
import { Link } from 'react-router-dom';

const QuotationsList: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    quotationsApi.getAll().then(res => setQuotations(res.data.data));
  }, []);

  return (
    <div>
      <h2>All Quotations</h2>
      <ul>
        {quotations.map(q => (
          <li key={q._id}>
            <Link to={`/quotations/${q._id}`}>{q.customerName} - {q.totalAmount} ({q.status})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuotationsList; 