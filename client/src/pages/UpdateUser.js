import React from "react";
import { Button, Container, Form } from "react-bootstrap";

function UpdateUser() {
  async function update() {
    const newUsername = document.getElementById("input-username").value;
    const email = document.getElementById("input-email").value;
    
    const response = await fetch('http://localhost:3001/api/users/requpdate', {
      method: 'POST',
      body: JSON.stringify({ newUsername, email }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    if (response.ok && email !== "" && email !== localStorage.getItem('email')) {
      localStorage.setItem('temp_email', email);
      window.location.href = `/verifyuserupdate`;
    } else if (response.ok && email === "" || email === localStorage.getItem('email')) {
      window.location.href = `/profile`;
    }
  }

  return (
    <div id="loginPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
      <Container className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Update</h1>

        <Form>
          <Form.Group controlId="input-username">
            <Form.Label>Username:</Form.Label>
            <Form.Control type="text" name="message" />
          </Form.Group>
          <Form.Group controlId="input-email">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" name="message" />
          </Form.Group>

          <Button variant="primary" className="mt-2" onClick={update}>Update User</Button>
        </Form>
      </Container>
    </div>
  );
}

export default UpdateUser;
