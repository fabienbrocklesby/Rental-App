import React from "react";

function Login() {
  async function loginUser() {
    const email = document.getElementById("input-email").value;

    const response = await fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });

    if (response.ok) {
      localStorage.setItem('email', email);
      window.location.href = '/verifyotp';
    }

    console.log(await response.json());
  }

  return (
    <div id="loginPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
      <div className="container bg-white p-4 rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Login</h1>

        <div className="mb-3">
          <input type="email" className="form-control" id="input-email" placeholder="Email" />
        </div>

        <button className="btn btn-primary" onClick={loginUser}>Login</button>
      </div>
    </div>
  );
}

export default Login;
