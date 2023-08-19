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
      const response = await fetch('/api/users/verifyotp', {
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
    <div id="otpPage" className="d-flex flex-column align-items-center container pt-5"  style={{ maxWidth: "500px" }}>
      <div className="container bg-white p-0 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
        <div className="text-center bg-primary py-3 rounded-top">
          <h1 className="text-white">Verify your code</h1>
        </div>

        <div className="p-4">
          <div className="mb-3">
            <label htmlFor="input-otp" className="form-label">OTP:</label>
            <input type="text" className="form-control" id="input-otp" name="message" />
            <p className="text-muted mt-1" style={{ fontSize: "12px" }}><u>Check your email.</u> Your code should've been sent to your email (make sure to check spam)</p>
          </div>

          {error && <p className="text-danger">{error}</p>}

          <button className="btn btn-primary" onClick={verifyOTP} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
