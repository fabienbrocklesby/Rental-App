import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import { Form, Button, Container } from 'react-bootstrap';

function NewItem() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch('http://localhost:3001/api/users/get/email', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(user => {
        setUser(user);
      })
      .catch(error => console.log(error));
  }, []);

  async function postNewItem() {
    setError("");
    
    const name = document.getElementById("input-name").value;
    const description = document.getElementById("input-description").value;
    const price = document.getElementById("input-price").value;
    const image = document.getElementById("input-image");

    if (!name || !description || !price || !image.files[0]) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image.files[0]);

    try {
      const response = await fetch('http://localhost:3001/api/items/create', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/listings';
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div id="newItemPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
      <Container className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
        <h1 className="text-center mb-4">New Item</h1>

        <Form>
          <Form.Group controlId="input-name">
            <Form.Label>Name:</Form.Label>
            <Form.Control type="text" name="message" />
          </Form.Group>
          <Form.Group controlId="input-description">
            <Form.Label>Description:</Form.Label>
            <Form.Control type="text" name="message" />
          </Form.Group>
          <Form.Group controlId="input-price">
            <Form.Label>Price:</Form.Label>
            <Form.Control type="text" name="message" />
          </Form.Group>
          <Form.Group controlId="input-image">
            <Form.Label>Image:</Form.Label>
            <Form.Control type="file" name="message" />
          </Form.Group>
          <Button variant="primary" className="mt-2" onClick={postNewItem} disabled={isLoading || !user.seller_verified || !user.stripe_account}>
            {isLoading ? "Loading..." : "Post Item"}
          </Button>
          
          {!user.seller_verified && <p className="text-danger mt-2">Please become a verified seller to post items. <a href="/profile" className="text-danger">Become one here!</a></p>}
          {error && <p className="text-danger mt-2">{error}</p>}
        </Form>
      </Container>
    </div>
  );
}

export default NewItem;
