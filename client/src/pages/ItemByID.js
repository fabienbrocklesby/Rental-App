import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Badge, ButtonGroup } from 'react-bootstrap';
import '../css/Home.css';
import AddToCart from '../components/AddToCart.js';
import ReqPurchase from '../components/RequestPurchase.js';

function ItemByID() {
  const [item, setItem] = useState({});
  const [showSellerOptions, setShowSellerOptions] = useState(false);
  let { id } = useParams();

  const loggedInUser = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://localhost:3001/api/items/${id}`)
      .then(response => response.json())
      .then(item => setItem(item))
      .catch(error => console.log(error))
  }, [id]);

  return (
    <div className="itemsPage" id="itemsPage">
      <Container>
        <Row>
          <Col md={6} className="mb-4">
            <Card className="h-100">
              <div className="item-image-container">
                <Card.Img variant="top" src={`/uploads/${item.img_dir}`} className="item-image" />
              </div>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <div className="description-container">
              <div className="description-box">
                <h1>
                  {item.name}
                </h1>
                <h4>Price: ${item.price}</h4>
                {item.available ? (
                  <Badge variant="success" className="item-badge">Available</Badge>
                ) : (
                  <Badge variant="danger" className="item-badge">Not Available</Badge>
                )}
              </div>
              <div className="description-box">
                <h3>Description</h3>
                <h5>{item.description}</h5>
              </div>
              {loggedInUser === item.seller_id ? (
                <div>
                  <Button
                    variant="secondary"
                    className="mb-2 mt-4"
                    onClick={() => setShowSellerOptions(!showSellerOptions)}
                  >
                    {showSellerOptions ? 'Hide Seller Options' : 'Show Seller Options'}
                  </Button>
                  {showSellerOptions && (
                    <div className="mt-2">
                      {item.available === true ? (
                          <div className="mb-2">
                            <Button
                            onClick={() => (window.location.href = `/deleteitem/${item.id}`)}
                            variant="danger"
                          >
                            Delete Item
                          </Button>
                        </div>
                      ): null}
                      <div className="mb-2">
                        <Button
                          onClick={() => (window.location.href = `/updateitem/${item.id}`)}
                          variant="info"
                        >
                          Update Item
                        </Button>
                      </div>
                      {item.available === false && (
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
                  {item.available === true ? (
                    <>
                      {item.cart_id !== loggedInUser ? (
                        <AddToCart itemId={item.id} />
                      ) : (
                        <ReqPurchase itemId={item.id} />
                      )}
                    </>
                  ): null}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ItemByID;
