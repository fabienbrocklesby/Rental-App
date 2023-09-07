import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function SuccessfulPayment() {
  const { id } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPaymentData() {
      try {
        const response = await fetch(`/api/payment/success/${id}`, {
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
    return <div className="defaultPageLayout">Loading...</div>;
  }

  if (!paymentData) {
    return <div>Error fetching payment data</div>;
  }

  return (
    <div id="paymentConfirmationPage" className="defaultPageLayout d-flex flex-column align-items-center container pt-5"  style={{ maxWidth: "500px" }}>
    <div className="container bg-white p-0 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
      <div className="text-center bg-primary py-3 rounded-top">
        <h1 className="text-white">Payment Successful</h1>
      </div>
      <div className="p-4">
        <h2>Transaction ID: {id}</h2>
        {paymentData.sellerEmail && (
          <>
            <h2 className="py-3">Seller Email: {paymentData.sellerEmail}</h2>
            <h5>(Please contact the seller to arrange collection)</h5>
          </>
        )}
      </div>
    </div>
    </div>
  );
}

export default SuccessfulPayment;
