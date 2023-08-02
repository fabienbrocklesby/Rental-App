import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SuccessfulPayment() {
  const { id } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaymentData() {
      try {
        const response = await fetch(`http://localhost:3001/api/payment/success/${id}`, {
          method: 'POST',
          credentials: 'include',
        });
        const data = await response.json();
        setPaymentData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setLoading(false);
      }
    }

    fetchPaymentData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!paymentData) {
    return <div>Error fetching payment data</div>;
  }

  return (
    <div>
      <h1>Payment Successful</h1>
      <h2>Transaction ID: {id}</h2>
    </div>
  );
}

export default SuccessfulPayment;
