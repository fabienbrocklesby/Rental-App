import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function registerUser() {
    setError("");
    setIsLoading(true);

    const otp = document.getElementById("input-otp").value;
    
    try {
      const response = await fetch('http://localhost:3001/api/users/verifyupdate', {
        method: 'POST',
        body: JSON.stringify({ otp }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      });

      if (response.ok) {
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("email");
        window.localStorage.removeItem("temp_email");
        document.cookie = "access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        
        setTimeout(() => {
          window.location.href = "/login";
        }, 100); 
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div id="verifyOTP" className="container min-vh-100 d-flex flex-column align-items-center py-5">
      <Container className="bg-white p-0 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
        <div className="text-center bg-primary py-3 rounded-top">
          <h1 className="text-white">Verify Your Code</h1>
        </div>

        <div className="p-4">
          <Form>
            <Form.Group controlId="input-otp">
              <Form.Label>Validation Code:</Form.Label>
              <Form.Control type="text" name="message" />
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <Button variant="primary" className="mt-2" onClick={registerUser} disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Register;
