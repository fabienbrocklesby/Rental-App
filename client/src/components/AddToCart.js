import { Button } from 'react-bootstrap';
import { useState } from 'react';

function AddToCart({ itemId }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isBookingError, setIsBookingError] = useState(false);

  async function addToCart() {
    try {
      if (!isDateSelected) {
        alert('Please select a date');
        return;
      }

      const date = selectedDate;

      const response = await fetch('/api/items/addtocart', {
        method: 'POST',
        body: JSON.stringify({ itemId, date }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (response.ok) {
        localStorage.setItem(`${itemId}`, await response.json())
        window.location.href = `/items/${itemId}`
      } else {
        setIsBookingError(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="add-to-cart mt-2">
      <div className="form-group">
        <h5 className="mt-2">Booking Date: </h5>
        <input
          type="date"
          className="form-control"
          id="input-date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setIsDateSelected(true);
            setIsBookingError(false);
          }}
          onBlur={() => setIsDateSelected(selectedDate !== '')}
        />
        {!isDateSelected && (
          <small className="text-danger">Please select a date</small>
        )}
        {isBookingError && (
          <small className="text-danger">Item is booked on this date</small>
        )}
      </div>
      <Button onClick={addToCart} variant="primary" className="mt-2">
        Add To Cart
      </Button>
    </div>
  );  
}

export default AddToCart;
