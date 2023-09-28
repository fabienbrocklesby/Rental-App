import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Badge, Modal } from 'react-bootstrap';
import '../css/Home.css';

function ProfilePage() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showBankConfirmationModal, setShowBankConfirmationModal] = useState(false);
  const [showBusinessConfirmationModal, setShowBusinessConfirmationModal] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);

  useEffect(() => {
    fetch('/api/users/get/email', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(user => {
        setUser(user);

        if (user.business) {
          fetch('/api/businesses/get', {
            method: 'GET',
            credentials: 'include',
          })
            .then(response => response.json())
            .then(business => {
              setUser(prevUser => ({ ...prevUser, business: business }));
            })
            .catch(error => console.log(error));
        }
      })
      .catch(error => console.log(error));
  }, []);


  async function handleVerifySeller() {
    setShowBankConfirmationModal(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/create/stripeaccount', {
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

  async function deleteBusiness() {
    try {
      const response = await fetch('/api/businesses/delete', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      console.log(data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="defaultPageLayout">
      <Container>
        <Row className="justify-content-center rounded align-items-center bg-light p-5">
          <Col xs="auto" className="text-center">
            <h2>Username: {user.username}</h2>
            <h3>Email: {user.email}</h3>
            {localStorage.getItem('userId') === user.id ? (
              <>
                <div className="mt-2">
                  <Button variant="primary" className="mx-1 mt-2" onClick={() => window.location.href = `/updateuser`}>
                    Update User
                  </Button>
                  <Button variant="danger" className="mx-1 mt-2" onClick={() => window.location.href = `/reqdeleteuser`}>
                    Delete User
                  </Button>
                </div>
                {user.seller_verified === true && user.stripe_account ? (
                  <div className="bg-white mt-5 p-4 rounded border">
                    <Badge variant="info" className="bg-success p-2">
                      Verified Seller
                    </Badge>
                    <div className="mt-4">
                      <Button variant="success" className="mx-1" onClick={() => setShowBankConfirmationModal(true)} disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Update bank details"}
                      </Button>
                      {isLoading && <p className="text-secondary mt-2">Please wait...</p>}
                    </div>
                  </div>

                ) : (
                  <>
                    <div className="bg-white mt-5 p-4 rounded border">
                      <h5>Not a Verified Seller</h5>
                      <p>(Bank Account Required)</p>
                      <Button variant="success" className="mx-1" onClick={() => setShowBankConfirmationModal(true)} disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify Now!"}
                      </Button>
                      {isLoading && <p className="text-secondary mt-2">Please wait...</p>}
                    </div>
                  </>
                )}
                {user.business ? (
                  <div className="pt-4">
                    <Button
                      variant="primary"
                      className="mx-1 mt-4"
                      onClick={() => setShowBusinessInfo(!showBusinessInfo)}
                    >
                      {showBusinessInfo ? 'Hide Business Info' : 'Show Business Info'}
                    </Button>
                    {showBusinessInfo && user.business ? (
                      <div className="bg-white mt-5 p-4 rounded border">
                        <h2>Business Information:</h2>
                        {!user.business.verified ? (
                          <>
                            <Badge variant="info" className="bg-danger p-2">
                              Unverified Business
                            </Badge>
                            <p className="mt-2">Please wait for our admin to verify your business</p>
                          </>
                        ) : null}
                        <div className="mt-3 py-2">
                          <h5>Business Website:</h5>
                          <p style={{ fontSize: '14px', lineHeight: '1' }}>
                            <em>Note: You can only use this domain for listings</em>
                          </p>
                          <a href={user.business.website} style={{ fontSize: '16px' }}>{user.business.website}</a>
                        </div>
                        {user.business.updated_website ? (
                          <div className="mt-3 py-2">
                            <h5>Requested Business Website:</h5>
                            <p style={{ fontSize: '14px', lineHeight: '1' }}>
                              <em>An admin is currently reviewing this domain</em>
                            </p>
                            <a href={user.business.updated_website} style={{ fontSize: '16px' }}>{user.business.updated_website}</a>
                          </div>
                        ) : null}
                        <div className="mt-2">
                          <Button variant="primary" className="mx-1 mt-2" onClick={() => window.location.href = `/updatebusiness`}>
                            Update Business
                          </Button>
                          <Button variant="danger" className="mx-1 mt-2" onClick={() => setShowBusinessConfirmationModal(true)}>
                            Delete Business
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="pt-4">
                    <Button
                      variant="primary"
                      className={`mx-1 mt-4 ${!user.seller_verified ? 'disabled' : ''}`}
                      onClick={() => {
                        if (user.seller_verified) {
                          window.location.href = `/registerbusiness`;
                        }
                      }}
                    >
                      Register As Business Account
                    </Button>
                    {!user.seller_verified && (
                      <p className="mt-2 text-danger">You must be a verified seller to register as a business account</p>
                    )}

                  </div>
                )}
              </>
            ) : null}
          </Col>
        </Row>
      </Container>

      <Modal show={showBankConfirmationModal} onHide={() => setShowBankConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update Bank Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm that you want to update your bank details.
          <ul>
            <li>
              By updating your bank details, you may not be able to receive payments or conduct financial transactions.
            </li>
            <li>
              Please be aware that once confirmed, you will no longer be considered a verified seller.
            </li>
            <li>
              You will need to undergo the verification process again to regain verified seller status.
            </li>
          </ul>
          By confirming this action, you understand and accept the consequences mentioned above.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBankConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleVerifySeller}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showBusinessConfirmationModal} onHide={() => setShowBusinessConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Business</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirm that you want to delete your business account.
          <ul>
            <li>
              This action will delete all items/listings associated with your business that have external URLs.
            </li>
            <li>
              Any past clicks on your external links will still be charged.
            </li>
            <li>
              If you decide to register as a business again, you will need to go through the verification process again.
            </li>
          </ul>
          By confirming this action, you understand and accept the consequences mentioned above.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBusinessConfirmationModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteBusiness}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfilePage;
