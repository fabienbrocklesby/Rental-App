import { Button } from 'react-bootstrap';

function requestPurchase({ itemId, cartId }) {
  async function reqPurchase() {
    console.log(cartId);
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

  return (
    <div className="add-to-cart mt-2">
      <Button onClick={reqPurchase} variant="primary">
        Request Purchase
      </Button>
    </div>
  )
}

export default requestPurchase;
