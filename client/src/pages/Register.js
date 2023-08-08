import React from "react";

function Register() {
  async function registerUser() {
    const username = document.getElementById("input-username").value;
    const email = document.getElementById("input-email").value;

    const response = await fetch('http://localhost:3001/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    if (response.ok) {
      window.location.href = "/verifyotp"
    }
  }

  return (
    <div id="registerPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
      <div className="container bg-white p-4 rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Register</h1>

        <div className="mb-3">
          <input type="text" className="form-control" id="input-username" placeholder="Username" />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" id="input-email" placeholder="Email" />
        </div>

        <button className="btn btn-primary" onClick={registerUser}>Register</button>
      </div>
    </div>
  );
}

export default Register;
