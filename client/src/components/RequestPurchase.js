import { Button } from 'react-bootstrap';
import { useState } from 'react';

function requestPurchase({ item }) {
  const cartId = localStorage.getItem(`${item.id}`);
  const itemId = item.id;
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);

  async function reqPurchase() {
    setIsPurchaseLoading(true);
    const response = await fetch('/api/items/purchase', {
      method: 'POST',
      body: JSON.stringify({ itemId, cartId }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    const responseData = await response.json();
    console.log(responseData);

    window.location.href = responseData;
  }

  function resetCart(cartId) {
    setIsRemoveLoading(true);
    fetch(`/api/items/reset/cart/${cartId}`, {
      method: 'GET'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to reset cart');
        }
        location.reload();
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsRemoveLoading(false);
      });
  }

  return (
    <div id="RequestPurchase">
      <div class='description-box py-4 bg-light rounded'>
        <div class='row'>
          <div class='col'>
            <div class='card p-3'>
              <h6 class='card-title mb-2 text-muted'>Start Date</h6>
              <p class='card-text'>{localStorage.getItem(`${item.id}-startDate`)}</p>
            </div>
          </div>
          <div class='col'>
            <div class='card p-3'>
              <h6 class='card-title mb-2 text-muted'>End Date</h6>
              <p class='card-text'>{localStorage.getItem(`${item.id}-endDate`)}</p>
            </div>
          </div>
        </div>
        <div class='d-flex flex-column flex-md-row align-items-md-center align-items-start mt-3'>
          <Button onClick={reqPurchase} variant="primary" disabled={isPurchaseLoading}>
            {isPurchaseLoading ? 'Loading...' : 'Request Purchase'}
          </Button>
          <div class='d-md-block d-flex'>
            <button class='btn btn-danger mr-md-2 mt-2 mt-md-0 px-2 mx-md-2' onClick={() => resetCart(localStorage.getItem(`${item.id}`))} disabled={isRemoveLoading}>
              {isRemoveLoading ? 'Loading...' : 'Remove From Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default requestPurchase;