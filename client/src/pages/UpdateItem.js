import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function UpdateItem() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  async function PostUpdateItem() {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);

    if (image) {
      const img = new Image();
      img.src = URL.createObjectURL(image);

      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const cropSize = Math.min(img.width, img.height);
        const cropX = (img.width - cropSize) / 2;
        const cropY = (img.height - cropSize) / 2;

        const thumbnailCanvas = document.createElement('canvas');
        const thumbnailCtx = thumbnailCanvas.getContext('2d');
        thumbnailCanvas.width = cropSize;
        thumbnailCanvas.height = cropSize;

        thumbnailCtx.drawImage(canvas, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);

        thumbnailCanvas.toBlob((blob) => {
          formData.append('image', blob, image.name);

          fetch('http://localhost:3001/api/items/update', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          }).then((response) => {
            if (response.ok) {
              window.location.href = `/items/${id}`;
            }
          });
        }, 'image/jpeg');
      };
    } else {
      const response = await fetch('http://localhost:3001/api/items/update', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = `/items/${id}`;
      }
    }
  }

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  return (
    <div>
      <div id="newItemPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
        <Container className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: '500px', backgroundColor: '#f0f0f0' }}>
          <h1 className="text-center mb-4">Update Item</h1>

          <Form>
            <Form.Group controlId="input-name">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" name="message" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="input-description">
              <Form.Label>Description:</Form.Label>
              <Form.Control type="text" name="message" value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="input-price">
              <Form.Label>Price per day:</Form.Label>
              <Form.Control type="text" name="message" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="input-image">
              <Form.Label>Image:</Form.Label>
              <Form.Control type="file" name="message" onChange={handleImageChange} />
            </Form.Group>
            <Button variant="primary" className="mt-2" onClick={PostUpdateItem}>Update Item</Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default UpdateItem;
