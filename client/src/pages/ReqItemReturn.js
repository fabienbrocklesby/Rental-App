import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Modal, Row, Col } from 'react-bootstrap';
import '../css/Home.css';

function ReturnItem() {
  const { id } = useParams();
  const [showModal, setShowModal] = React.useState(false);

  async function postNewItem() {
    const response = await fetch('http://localhost:3001/api/items/return', {
      method: 'POST',
      body: JSON.stringify({ itemId: id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    });

    if (response) {
      window.location.href="/renteditems"
    }
  }

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div className="returnItemPage">
      <Container>
        <Row className="justify-content-center align-items-center rounded bg-light p-5">
          <Col xs="auto" className="text-center">
            <h1>Return Item</h1>
            <Button variant="primary" onClick={handleShow}>Request Item Return</Button>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Return</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to return this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={postNewItem}>
            Return Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReturnItem;
