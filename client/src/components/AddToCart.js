import { Button } from 'react-bootstrap';

function AddToCart({ itemId }) {
  async function addToCart() {
    try {
      const response = await fetch('http://localhost:3001/api/items/addtocart', {
        method: 'POST',
        body: JSON.stringify({ itemId }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (response.ok) {
        window.location.href = `/items/${itemId}`
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="add-to-cart mt-2">
      <Button onClick={addToCart} variant="primary">
        Add To Cart
      </Button>
    </div>
  );  
}

export default AddToCart;
