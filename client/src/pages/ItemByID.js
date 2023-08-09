import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import '../css/Home.css';
import Header from '../components/Header.js';
import AddToCart from '../components/AddToCart.js';
import ReqPurchase from '../components/RequestPurchase.js';

function ItemByID() {
  const [item, setItem] = useState({});
  let { id } = useParams();

  const loggedInUser = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://localhost:3001/api/items/${id}`)
      .then(response => response.json())
      .then(item => setItem(item))
      .catch(error => console.log(error))
  }, [id]);

  console.log(loggedInUser, item.cart_id)

  return (
    <div className="itemsPage" id="itemsPage">
      <Header />
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
                  <h2>You are the seller of this item</h2>
                  <Button className="mr-2" onClick={() => window.location.href = `/deleteitem/${item.id}`} variant="danger">Delete Item</Button>
                  <Button onClick={() => window.location.href = `/updateitem/${item.id}`} variant="info">Update Item</Button>
                  {item.available === false && (
                    <div>
                      <h2>This item is currently rented</h2>
                      <Button onClick={() => window.location.href = `/receipt/${item.id}`} variant="primary">
                        {item.return_status === 'pending' ? 'Accept Return' : 'Receipt Item'}
                      </Button>
                    </div>
                  )}
                </div>
              ): null}
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
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ItemByID;
