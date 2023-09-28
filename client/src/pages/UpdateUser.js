import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

function UpdateUser() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function update() {
    setError("");
    const newUsername = document.getElementById("input-username").value;
    const email = document.getElementById("input-email").value;
    
    if (!newUsername.trim() && !email.trim()) {
      setError("Please provide at least one value to update.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/requpdate', {
        method: 'POST',
        body: JSON.stringify({ newUsername, email }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (response.ok && email !== "" && email !== localStorage.getItem('email')) {
        localStorage.setItem('temp_email', email);
        window.location.href = `/verifyuserupdate`;
      } else if (response.ok && (email === "" || email === localStorage.getItem('email'))) {
        window.location.href = `/profile`;
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
    <div id="verifyOTP" className="container defaultPageLayout d-flex flex-column align-items-center py-5">
      <Container className="bg-white p-0 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
        <div className="text-center bg-primary py-3 rounded-top">
          <h1 className="text-white">Update User</h1>
        </div>

        <div className="p-4">
          <Form>
            <Form.Group controlId="input-username">
              <Form.Label>Username:</Form.Label>
              <Form.Control type="text" name="message" />
            </Form.Group>
            <Form.Group controlId="input-email">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" name="message" />
            </Form.Group>
            <p className="text-muted mt-1" style={{ fontSize: "12px" }}><u>Tip:</u> You only need to provide what you want to update (you can update both email and username at the same time as well)</p>

            {error && <p className="text-danger">{error}</p>}
            <Button variant="primary" className="mt-2" onClick={update} disabled={isLoading}>
              {isLoading ? "Loading..." : "Update User"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default UpdateUser;
