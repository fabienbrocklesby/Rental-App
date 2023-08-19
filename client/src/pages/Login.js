import React, { useState } from "react";
import { Container } from "react-bootstrap";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function loginUser() {
    if (isLoading) {
      return; 
    }

    setError("");
    setIsLoading(true);

    const email = document.getElementById("input-email").value;

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (response.ok) {
        localStorage.removeItem('email');
        localStorage.removeItem('userId')
        localStorage.setItem('email', email);
        window.location.href = '/verifyotp';
      } else {
        setError("Login failed. Please check your email and try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.log(error);
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <div id="loginPage" className="d-flex flex-column align-items-center container pt-5"  style={{ maxWidth: "500px" }}>
      <Container  className="bg-white p-0 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
        <div className="text-center bg-primary py-3 rounded-top">
          <h1 className="text-white">Login</h1>
        </div>

        <div className="p-4 my-2">
          <div className="mb-3">
            <input type="email" className="form-control" id="input-email" placeholder="Email" />
            <p className="text-muted mt-1" style={{ fontSize: "12px" }}><u>How it works:</u> You type in your email, we'll send you a verification code, no passwords needed!</p>
          </div>
          
          <button className="btn btn-primary mt-1" onClick={loginUser} disabled={isLoading}>
            {isLoading ? "Sending code..." : "Send verification code"}
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </Container>
    </div>
  );
}

export default Login;
