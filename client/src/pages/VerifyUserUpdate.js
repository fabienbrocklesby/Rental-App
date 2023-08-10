import React from "react";
import { Button, Container, Form } from "react-bootstrap";

function Register() {
  async function registerUser() {
    const otp = document.getElementById("input-otp").value;
    
    const response = await fetch('http://localhost:3001/api/users/verifyupdate', {
      method: 'POST',
      body: JSON.stringify({ otp }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
    })

    if (response.ok) {
      localStorage.setItem('email', localStorage.getItem('temp_email'));
      localStorage.removeItem('temp_email');
      window.location.href = `/profile`;
    }
  }

  return (
    <div id="loginPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
      <Container className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Verify Update</h1>

        <Form>
          <Form.Group controlId="input-otp">
            <Form.Label>OTP:</Form.Label>
            <Form.Control type="text" name="message" />
          </Form.Group>

          <Button variant="primary" className="mt-2" onClick={registerUser}>Verify OTP</Button>
        </Form>
      </Container>
    </div>
  );
}

export default Register;
