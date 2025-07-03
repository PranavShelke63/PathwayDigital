import React from 'react';
import { useParams } from 'react-router-dom';

const QuotationView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <div>Quotation ID: {id}</div>;
};

export default QuotationView; 