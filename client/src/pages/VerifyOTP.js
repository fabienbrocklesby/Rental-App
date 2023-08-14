import React, { useState } from "react";

function VerifyOTP() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function verifyOTP() {
    setError("");
    setIsLoading(true);

    const email = localStorage.getItem('email');
    const otp = document.getElementById("input-otp").value;

    try {
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
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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

        {error && <p className="text-danger">{error}</p>}

        <button className="btn btn-primary" onClick={verifyOTP} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}

export default VerifyOTP;
