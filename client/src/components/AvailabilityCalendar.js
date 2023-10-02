import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import '../css/Home.css';

import AddToCart from './AddToCart';

const Calendar = ({ itemId }) => {
  const [date, setDate] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchUnavailableDates() {
      try {
        const response = await fetch(`/api/items/getunavailabledates/${itemId}`);
        if (response.ok) {
          const data = await response.json();
          const dates = data.map((date) => new Date(date.date));
          setUnavailableDates(dates);
        } else {
          console.error(`Failed to fetch unavailable dates for item ${itemId}`);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchUnavailableDates();
  }, [itemId]);

  const daysInMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  };

  const startOfMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek.map((day, index) => (
      <th key={index}>{day}</th>
    ));
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth();
    const startingDay = startOfMonth();

    for (let i = 0; i < startingDay; i++) {
      days.push(<td key={`empty-${i}`}></td>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${day < 10 ? '0' : ''}${day}`;
      const isUnavailable = unavailableDates.some((date) => {
        const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
        return dateStr === dateString;
      });
      const className = isUnavailable ? 'unavailable-day' : '';
      days.push(<td key={day} className={className}>{day}</td>);
    }

    const rows = [];
    let cells = [];

    days.forEach((day, index) => {
      if (index % 7 === 0) {
        rows.push(cells);
        cells = [];
      }
      cells.push(day);
    });

    rows.push(cells);

    return rows.map((row, index) => (
      <tr key={index}>{row}</tr>
    ));
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className='description-box py-4'>
      <h3>Availability Calendar</h3>
      <Button onClick={handleShowModal} variant="primary" className="mt-1">
        Open Calendar
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-start mb-3">
            <Button onClick={handlePrevMonth} variant={isCurrentMonth() ? 'outline-secondary' : 'outline-primary'} className="me-2" disabled={isCurrentMonth()}>Previous Month</Button>
            <Button onClick={handleNextMonth} variant="outline-primary">Next Month</Button>
          </div>
          <Table className="calendar">
            <thead>
              <tr>{renderDaysOfWeek()}</tr>
            </thead>
            <tbody>
              {renderCalendar()}
            </tbody>
          </Table>
          <Row>
            <Col>
              <AddToCart itemId={itemId} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Calendar;