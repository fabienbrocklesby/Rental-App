import React, { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function registerUser() {
    setError("");
    const usernameInput = document.getElementById("input-username");
    const emailInput = document.getElementById("input-email");

    if (!usernameInput.value.trim() || !emailInput.value.trim()) {
      setError("Please fill in both username and email.");
      return;
    }

    if (username.includes(" ")) {
      setError("Username must be one word.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        body: JSON.stringify({ username, email }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (response.ok) {
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.setItem('email', email);
        window.location.href = "/verifyotp";
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
    <div id="registerPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
      <div className="container bg-white p-4 rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Register</h1>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="input-username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            id="input-email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button className="btn btn-primary" onClick={registerUser} disabled={isLoading}>
          {isLoading ? "Loading..." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default Register;
