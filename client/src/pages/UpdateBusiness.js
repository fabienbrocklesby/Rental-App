import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

function UpdateBusiness() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState("");
  const [currentUpdatedWebsite, setCurrentUpdatedWebsite] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  useEffect(() => {
    fetch('/api/businesses/get', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(business => {
        setCurrentWebsite(business.website);
        setCurrentUpdatedWebsite(business.updated_website);
      })
      .catch(error => console.log(error));
  }, []);

  async function updateBusiness() {
    if (isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    let updatedWebsite = newWebsite;
    if (!updatedWebsite.startsWith("https://") && !updatedWebsite.startsWith("http://")) {
      updatedWebsite = "https://" + updatedWebsite;
    }

    try {
      const response = await fetch('/api/businesses/update', {
        method: 'PUT',
        body: JSON.stringify({ website: updatedWebsite }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (response.ok) {
        window.location.href = '/profile';
      } else {
        setError("Business update failed. Please check the website and try again.");
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
          <h1 className="text-white">Update Business</h1>
        </div>

        <div className="p-4 my-2">
          <form>
            <div className="mb-3">
              <label htmlFor="current-website" className="form-label">Current Website: <span className="text-danger">*This is read only*</span></label>
              <input
                type="text"
                className="form-control"
                id="current-website"
                value={currentWebsite}
                readOnly
              />
            </div>

            {currentUpdatedWebsite ? (
              <div className="mb-3">
                <label htmlFor="current-website" className="form-label">Requested Website: <span className="text-danger">*This is read only*</span></label>
                <input
                  type="text"
                  className="form-control"
                  id="current-website"
                  value={currentUpdatedWebsite}
                  readOnly
                />
              </div>
            ): null}

            <div className="mb-3">
              <label htmlFor="new-website" className="form-label">New Website:</label>
              <input
                type="text"
                className="form-control"
                id="new-website"
                placeholder="New Business Website"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary mt-1" onClick={updateBusiness} disabled={isLoading}>
              {isLoading ? "Updating Business..." : "Update Business"}
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
        </div>
      </Container>
    </div>
  );
}

export default UpdateBusiness;
