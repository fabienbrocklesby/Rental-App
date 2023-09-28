import React, { useState } from "react";
import { Container } from "react-bootstrap";

function CreateBusinessAccount() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function createBusiness() {
    if (isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    let website = document.getElementById("input-website").value;

    if (!website.startsWith("https://") && !website.startsWith("http://")) {
      website = "https://" + website;
    }

    try {
      const response = await fetch('/api/businesses/create', {
        method: 'POST',
        body: JSON.stringify({ website }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (response.ok) {
        window.location.href = 'profile'
      } else {
        setError("Business creation failed. Please check the website and try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="defaultPageLayout d-flex flex-column align-items-center container" style={{ maxWidth: "500px" }}>
      <Container className="bg-white p-0 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
        <div className="text-center bg-primary py-3 rounded-top">
          <h1 className="text-white">Create Business Account</h1>
        </div>

        <div className="p-4 my-2">
          <form>
            <div className="mb-3">
              <input type="text" className="form-control" id="input-website" placeholder="Business Website" />
            </div>

            <button type="submit" className="btn btn-primary mt-1" onClick={createBusiness} disabled={isLoading}>
              {isLoading ? "Creating Business..." : "Create Business Account"}
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
        </div>
      </Container>
    </div>
  );
}

export default CreateBusinessAccount;
