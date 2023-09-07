import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Modal, Row, Col } from 'react-bootstrap';
import '../css/Home.css';

function ReceiptItem() {
  const { id } = useParams();
  const [showModal, setShowModal] = React.useState(false);

  async function postNewItem() {
    const response = await fetch('/api/items/receipt', {
      method: 'POST',
      body: JSON.stringify({ itemId: id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    });

    if (response) {
      window.location.href = `/items/${id}`;
    }
  }

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div className="receiptItemPage defaultPageLayout">
      <Container>
        <Row className="justify-content-center rounded align-items-center bg-light p-5">
          <Col xs="auto" className="text-center">
            <h1>Receipt Item</h1>
            <Button variant="primary" onClick={handleShow}>Mark Item as Received</Button>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to mark this item as received?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={postNewItem}>
            Mark as Received
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReceiptItem;
