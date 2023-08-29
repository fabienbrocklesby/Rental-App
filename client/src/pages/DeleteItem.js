import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Modal, Row, Col } from 'react-bootstrap';
import '../css/Home.css';

function DeleteItem() {
  const { id } = useParams();
  const [showModal, setShowModal] = React.useState(false);

  async function confirmDelete() {
    const response = await fetch('/api/items/delete', {
      method: 'DELETE',
      body: JSON.stringify({ itemId: id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    });

    if (response) {
      window.location.href = '/listings';
    }
  }

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div className="deleteItemPage defaultPageLayout">
      <Container>
        <Row className="justify-content-center rounded align-items-center bg-light p-5">
          <Col xs="auto" className="text-center">
            <h1>Delete Item</h1>
            <Button variant="danger" onClick={handleShow}>Delete Item</Button>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeleteItem;
