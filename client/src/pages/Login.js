import React, { useState } from "react";

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
      const response = await fetch('http://localhost:3001/api/users/login', {
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
    <div id="loginPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
      <div className="container bg-white p-4 rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Login</h1>

        <div className="mb-3">
          <input type="email" className="form-control" id="input-email" placeholder="Email" />
        </div>

        <button className="btn btn-primary" onClick={loginUser} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
