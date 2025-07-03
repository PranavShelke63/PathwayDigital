import { useEffect, useState } from 'react';
import { quotationsApi, Quotation } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [quotationCount, setQuotationCount] = useState(0);
  const [recentQuotations, setRecentQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    quotationsApi.getAll().then(res => {
      setQuotationCount(res.data.data.length);
      setRecentQuotations(res.data.data.slice(0, 5)); // Show 5 most recent
    });
  }, []);

  return (
    <div>
      <section>
        <h2>Quotations</h2>
        <p>Total Quotations: {quotationCount}</p>
        <ul>
          {recentQuotations.map(q => (
            <li key={q._id}>
              <Link to={`/quotations/${q._id}`}>{q.customerName} - {q.totalAmount} ({q.status})</Link>
            </li>
          ))}
        </ul>
        <Link to="/quotations">View All Quotations</Link>
      </section>
    </div>
  );
};

export default Dashboard; 