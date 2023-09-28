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
      const response = await fetch('/api/users/register', {
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
    <div id="registerPage" className="defaultPageLayout d-flex flex-column align-items-center container pt-5"  style={{ maxWidth: "500px" }}>
      <div className="container bg-white p-0 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
        <div className="text-center bg-primary py-3 rounded-top">
          <h1 className="text-white">Register</h1>
        </div>

        <form>
          <div className="p-4">
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
            <p className="text-muted mt-1" style={{ fontSize: "12px" }}><u>No password needed!</u> We'll send a verification code to your email so you can log in!</p>

            {error && <p className="text-danger">{error}</p>}

            <button type="submit" className="btn btn-primary" onClick={registerUser} disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
