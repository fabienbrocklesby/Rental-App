import { Button } from 'react-bootstrap';

function requestPurchase({ itemId }) {

  async function reqPurchase() {
    const response = await fetch('http://localhost:3001/api/items/purchase', {
      method: 'POST',
      body: JSON.stringify({ itemId }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    window.location.href = await response.json()
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