import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuotationForm from './QuotationForm';

const QuotationBillPage: React.FC = () => {
  const navigate = useNavigate();
  return <QuotationForm onClose={() => navigate('/admin')} />;
};

export default QuotationBillPage; 