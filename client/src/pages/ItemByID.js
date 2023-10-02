import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import '../css/Home.css';

import AddToCart from '../components/AddToCart.js';
import ReqPurchase from '../components/RequestPurchase.js';
import AvailabilityCalendar from '../components/AvailabilityCalendar.js';

import loggedInStatus from '../Functions/checkLoggedInStatus.js';

function ItemByID() {
  const [item, setItem] = useState({});
  const [showSellerOptions, setShowSellerOptions] = useState(false);
  const [sellerUsername, setSellerInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  let { id } = useParams();

  let loggedIn = loggedInStatus();

  const loggedInUser = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then(response => response.json())
      .then(item => setItem(item))
      .catch(error => console.log(error))
  }, [id]);

  useEffect(() => {
    if (item.seller_id) {
      fetch(`/api/users/${item.seller_id}`)
        .then(response => response.json())
        .then(sellerUsername => setSellerInfo(sellerUsername.username))
        .catch(error => console.log(error))
    }
  }, [item.seller_id]);

  useEffect(() => {
    if (loggedIn) {
      fetch('/api/items/cart', {
        method: 'GET',
        credentials: 'include',
      })
        .then(response => response.json())
        .then(userCart => setCartItems(userCart || []))
        .catch(error => console.error('An error occurred while fetching cart items:', error));
    }
  }, [loggedIn]);

  return (
    <div className="itemsPage" id="itemsPage">
      <Container>
        <Row>
          <div className="col-md-6 mb-4">
            <div className="item-image-container">
              <Card.Img variant="top" src={`/uploads/${item.img_dir}`} className="item-image" />
            </div>
          </div>
          <Col md={6} className="mb-4">
            <div className="description-container">
              <div className="description-box">
                <h1>
                  {item.name}
                </h1>
                <h4>Price: ${item.price} / day</h4>
                {item.available ? (
                  <Badge variant="success" className="item-badge">Available</Badge>
                ) : (
                  <Badge variant="danger" className="item-badge">Not Available</Badge>
                )}
                {item.external_url && (
                  <span className="badge bg-primary mb-2 mx-2" data-bs-toggle="tooltip" data-bs-placement="top" title="This listing leads to another website">
                    External Listing
                  </span>
                )}
              </div>
              <div className="description-box">
                <h3>Description</h3>
                <h5>{item.description}</h5>
              </div>
              <div className="description-box">
                <h6 className="mt-2">Posted On: {new Date(item.created_at).toLocaleDateString()}</h6>
                <h6>By: {sellerUsername}</h6>
                <h5>{item.location}, New Zealand</h5>
              </div>
              {loggedIn === true ? (
                <>
                  {loggedInUser === item.seller_id ? (
                    <div>
                      {item.external_url && (
                        <div>
                          <Button href={item.external_url} variant="primary" className="mt-4">
                            View Listing
                          </Button>
                        </div>
                      )}
                      <Button
                        variant="secondary"
                        className="mb-2 mt-4"
                        onClick={() => setShowSellerOptions(!showSellerOptions)}
                      >
                        {showSellerOptions ? 'Hide Seller Options' : 'Show Seller Options'}
                      </Button>
                      {showSellerOptions && (
                        <div className="mt-2">
                          {!item.holder_id ? (
                            <div className="mb-2">
                              <Button
                                onClick={() => (window.location.href = `/deleteitem/${item.id}`)}
                                variant="danger"
                              >
                                Delete Item
                              </Button>
                            </div>
                          ) : null}
                          <div className="mb-2">
                            <Button
                              onClick={() => (window.location.href = `/updateitem/${item.id}`)}
                              variant="info"
                            >
                              Update Item
                            </Button>
                          </div>
                          {item.holder_id && (
                            <div className="mt-4 border p-3 bg-light rounded">
                              <h2 className="mb-3">This item is currently rented</h2>
                              <Button
                                onClick={() => (window.location.href = `/receipt/${item.id}`)}
                                variant="primary"
                              >
                                {item.return_status === 'pending' ? 'Accept Return' : 'Receipt Item'}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <>
                        {Array.isArray(cartItems) && cartItems.some(cartItem => cartItem.id === item.id) ? (
                          <ReqPurchase item={item} />
                        ) : (
                          <AvailabilityCalendar itemId={item.id} />
                        )}
                      </>
                    </div>
                  )}
                </>
              ) : (
                <Button
                  onClick={() => (window.location.href = '/login')}
                  className="mt-4"
                >
                  Login to rent this item
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ItemByID;
