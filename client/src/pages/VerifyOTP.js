import React from "react";

function VerifyOTP() {
  async function verifyOTP() {
    const email = localStorage.getItem('email');
    const otp = document.getElementById("input-otp").value;

    const response = await fetch('http://localhost:3001/api/users/verifyotp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
    });

    if (response.ok) {
      const data = await response.json();
      const userId = data.id;

      localStorage.setItem('userId', userId);
      window.location.href = '/items';
    }
  }

  return (
    <div id="verifyOtpPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
      <div className="container bg-white p-4 rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Verify OTP:</h1>

        <div className="mb-3">
          <label htmlFor="input-otp" className="form-label">OTP:</label>
          <input type="text" className="form-control" id="input-otp" name="message" />
        </div>

        <button className="btn btn-primary" onClick={verifyOTP}>Verify OTP</button>
      </div>
    </div>
  );
}

export default VerifyOTP;
