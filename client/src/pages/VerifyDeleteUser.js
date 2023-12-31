import React from "react";
import { Button, Container, Form } from "react-bootstrap";

function Register() {

  async function verifyUserDelete() {
    const otp = document.getElementById("input-otp").value;
    
    const response = await fetch('/api/users/verifydelete', {
      method: 'DELETE',
      body: JSON.stringify({ otp }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
    })

    console.log(await response.json())
  }

  return (
    <div id="loginPage" className="defaultPageLayout d-flex flex-column align-items-center py-5">
      <Container className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Verify Delete User</h1>

        <Form>
          <Form.Group controlId="input-otp">
            <Form.Label>OTP:</Form.Label>
            <Form.Control type="password" name="message" />
          </Form.Group>

          <Button variant="primary" className="mt-2" onClick={verifyUserDelete}>Verify Delete</Button>
        </Form>
      </Container>
    </div>
  )
}

export default Register;
