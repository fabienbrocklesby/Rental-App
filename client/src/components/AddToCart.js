import { Button } from 'react-bootstrap';
import { useState } from 'react';

import '../css/Home.css';

function AddToCart({ itemId }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isBookingError, setIsBookingError] = useState(false);
  const [isDateError, setIsDateError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  function getEndDateMin() {
    return startDate !== '' ? startDate : undefined;
  }

  function getEndDateMax() {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14);
    return maxDate.toISOString().split('T')[0];
  }

  function handleStartDateChange(e) {
    const selectedStartDate = e.target.value;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14);

    setShowWarning(true);

    if (new Date(selectedStartDate) > maxDate) {
      setIsBookingError(true);
    } else {
      setIsBookingError(false);
      setStartDate(selectedStartDate);
      setIsDateSelected(endDate !== '' && selectedStartDate !== '');
    }
  }

  function handleEndDateChange(e) {
    const selectedEndDate = e.target.value;
    const selectedStartDate = startDate;
    const timeDiff = Math.abs(new Date(selectedEndDate) - new Date(selectedStartDate));
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    setShowWarning(false);

    if (diffDays > 14) {
      setIsBookingError(true);
    } else {
      setIsBookingError(false);
      setEndDate(selectedEndDate);
      setIsDateSelected(selectedStartDate !== '' && selectedEndDate !== '');
    }
  }

  async function addToCart() {
    try {
      setIsLoading(true);

      if (!isDateSelected) {
        alert('Please select a date range');
        return;
      }

      const currentDate = new Date();
      const selectedStartDate = new Date(startDate);

      if (selectedStartDate < currentDate) {
        setIsDateError(true);
        return;
      }

      const response = await fetch('/api/items/addtocart', {
        method: 'POST',
        body: JSON.stringify({ itemId, startDate, endDate }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(`${itemId}-startDate`, startDate);
        localStorage.setItem(`${itemId}-endDate`, endDate);
        localStorage.setItem(`${itemId}`, data);
        window.location.href = `/items/${itemId}`
      } else {
        setIsBookingError(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="add-to-cart mt-2 description-box">
      <div className="form-group row">
        <div className="col">
          <label htmlFor="input-start-date" className="clickable-label">Start Date:</label>
          <input
            type="date"
            className="form-control"
            id="input-start-date"
            value={startDate}
            onChange={handleStartDateChange}
            onBlur={() => setIsDateSelected(startDate !== '' && endDate !== '')}
            max={getEndDateMax()}
          />
        </div>
        <div className="col-auto mt-4">
          <h5 className="mt-1">-</h5>
        </div>
        <div className="col">
          <label htmlFor="input-end-date" className="clickable-label">End Date:</label>
          <input
            type="date"
            className="form-control"
            id="input-end-date"
            value={endDate}
            onChange={handleEndDateChange}
            onBlur={() => setIsDateSelected(startDate !== '' && endDate !== '')}
            min={getEndDateMin()}
            max={getEndDateMax()}
          />
        </div>
      </div>
      {!isDateSelected && (
        <><small className="text-danger">Please select a date range</small><br /></>
      )}
      {isBookingError && (
        <><small className="text-danger">The selected date range cannot be longer than two weeks</small><br /></>
      )}
      {isDateError && (
        <><small className="text-danger">The selected dates cannot be in the past</small><br /></>
      )}

      {showWarning && (
        <small className='font-weight-bold'>
          <span className="font-weight-bold">NOTE: </span>
          The selected date range cannot be longer than two weeks
        </small>
      )}
      <div className="mt-2">
        <Button onClick={addToCart} variant="primary" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Add To Cart'}
        </Button>
      </div>
    </div>
  );
}

export default AddToCart;