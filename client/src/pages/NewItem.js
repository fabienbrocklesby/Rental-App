import React, { useState } from 'react';
import '../css/Home.css';
import { Form, Button, Container } from 'react-bootstrap';

function NewItem() {
  async function postNewItem() {
    const name = document.getElementById("input-name").value;
    const description = document.getElementById("input-description").value;
    const price = document.getElementById("input-price").value;
    const image = document.getElementById("input-image");
    const imageFile = image.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    const img = new Image();
    img.src = URL.createObjectURL(imageFile);

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const cropSize = Math.min(img.width, img.height);
      const cropX = (img.width - cropSize) / 2;
      const cropY = (img.height - cropSize) / 2;

      const thumbnailCanvas = document.createElement("canvas");
      const thumbnailCtx = thumbnailCanvas.getContext("2d");
      thumbnailCanvas.width = cropSize;
      thumbnailCanvas.height = cropSize;

      thumbnailCtx.drawImage(canvas, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);

      thumbnailCanvas.toBlob((blob) => {
        formData.append("image", blob, imageFile.name);

        fetch('http://localhost:3001/api/items/create', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }).then(response => {
          if (response.ok) {
            window.location.href = '/listings';
          }
        });
      }, 'image/jpeg');
    };
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
          <Button variant="primary" className="mt-2" onClick={postNewItem}>Post Item</Button>
        </Form>
      </Container>
    </div>
  );
}

export default NewItem;
