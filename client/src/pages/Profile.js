import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Badge, Modal } from 'react-bootstrap';
import '../css/Home.css';

function ProfilePage() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/users/get/email', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(user => setUser(user))
      .catch(error => console.log(error))
  }, []);

  async function handleVerifySeller() {
    setShowConfirmationModal(false);
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/create/stripeaccount', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      
      window.location.href = data.url;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); 
    }
  }

  console.log(user);

  return (
    <div className="profilePage">
      <Container>
        <Row className="justify-content-center rounded align-items-center bg-light p-5">
          <Col xs="auto" className="text-center">
            <h2>Username: {user.username}</h2>
            <h3>Email: {user.email}</h3>
            {localStorage.getItem('userId') === user.id ? (
              <>
                <Button variant="primary" className="mx-1 mt-2" onClick={() => window.location.href = `/updateuser`}>
                  Update User
                </Button>
                <Button variant="danger" className="mx-1 mt-2" onClick={() => window.location.href = `/reqdeleteuser`}>
                  Delete User
                </Button>
                {user.seller_verified === true && user.stripe_account ? (
                  <div className="bg-white mt-5 p-4 rounded border">
                    <Badge variant="info" className="bg-success p-2">
                      Verified Seller
                    </Badge>
                    <div className="mt-4">
                      <Button variant="success" className="mx-1" onClick={() => setShowConfirmationModal(true)} disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Update bank details"}
                      </Button>
                      {isLoading && <p className="text-secondary mt-2">Please wait...</p>}
                    </div>
                  </div>
                  
                ): (
                  <>
                    <div className="bg-white mt-5 p-4 rounded border">
                      <h5>Not a Verified Seller</h5>
                      <p>(Bank Account Required)</p>
                      <Button variant="success" className="mx-1" onClick={() => setShowConfirmationModal(true)} disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify Now!"}
                      </Button>
                      {isLoading && <p className="text-secondary mt-2">Please wait...</p>}
                    </div>
                  </>
                )}
              </>
            ) : null}
          </Col>
        </Row>
      </Container>

      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update Bank Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to update your bank details?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleVerifySeller}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfilePage;
