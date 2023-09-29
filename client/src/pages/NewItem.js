import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Modal, Alert } from 'react-bootstrap';

function NewItem() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [verifiedBusiness, setVerifiedBusiness] = useState(false);
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [externalUrlError, setExternalUrlError] = useState("");

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const locations = [
    "Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin",
    "Palmerston North", "Napier", "Hastings", "Nelson", "Rotorua", "New Plymouth",
    "Whangārei", "Invercargill", "Whanganui", "Gisborne", "Wanganui", "Taranaki",
    "Manawatu-Wanganui", "Bay of Plenty", "Northland", "Waikato", "Wellington",
    "Canterbury", "Otago", "Southland", "Hawke's Bay", "Marlborough", "West Coast"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('/api/users/get/email', {
          method: 'GET',
          credentials: 'include',
        });
        const user = await userResponse.json();
        setUser(user);

        if (user.business) {
          const businessResponse = await fetch('/api/businesses/get', {
            method: 'GET',
            credentials: 'include',
          });
          const business = await businessResponse.json();
          setUser(prevUser => ({ ...prevUser, business: business }));
          setVerifiedBusiness(business.verified === true);
          setBusinessWebsite(business.website);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log(user, verifiedBusiness, businessWebsite)

  async function postNewItem() {
    setError("");

    const name = document.getElementById("input-name").value;
    const description = document.getElementById("input-description").value;
    const price = document.getElementById("input-price").value;
    const image = document.getElementById("input-image");

    if (!name || !description || !price || !image.files[0] || !selectedLocation) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.length < 2 || name.length > 70) {
      setNameError("Name must be between 2 and 70 characters.");
      return;
    } else {
      setNameError("");
    }

    if (description.length < 3 || description.length > 300) {
      setDescriptionError("Description must be between 3 and 300 characters.");
      return;
    } else {
      setDescriptionError("");
    }

    if (isNaN(price) || price < 0 || price > 1000000) {
      setPriceError("Price must be a number between 0 and 1000000.");
      return;
    } else {
      setPriceError("");
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", selectedLocation);

    if (user.business && user.business.verified) {
      let externalUrl = document.getElementById("input-external-url").value;

      if (externalUrl.trim() !== "") {
        if (!externalUrl.startsWith("https://") && !externalUrl.startsWith("http://")) {
          externalUrl = "https://" + externalUrl;
        }

        function getDomain(url) {
          try {
            const domain = new URL(url).hostname;
            return domain;
          } catch (error) {
            return null;
          }
        }

        if (getDomain(externalUrl) !== null) {
          if (getDomain(externalUrl) !== getDomain(businessWebsite)) {
            setError("External URL domain does not match the business website domain.");
            setIsLoading(false);
            return;
          }

          formData.append("externalUrl", externalUrl);
        } else {
          setError("External URL is not a valid URL.");
          setIsLoading(false);
          return;
        }
      }
    };

    const img = new Image();
    img.src = URL.createObjectURL(image.files[0]);

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const cropSize = Math.min(img.width, img.height);
      const cropX = (img.width - cropSize) / 2;
      const cropY = (img.height - cropSize) / 2;

      const thumbnailCanvas = document.createElement("canvas");
      const thumbnailCtx = thumbnailCanvas.getContext("2d");
      thumbnailCanvas.width = cropSize;
      thumbnailCanvas.height = cropSize;

      thumbnailCtx.drawImage(canvas, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);

      thumbnailCanvas.toBlob(async (blob) => {
        formData.append("image", blob, image.files[0].name);

        try {
          const response = await fetch('/api/items/create', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });

          if (response.ok) {
            window.location.href = '/listings';
          } else {
            setError("Something went wrong. Please try again.");
          }
        } catch (error) {
          setError("An error occurred. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }, 'image/jpeg');
    };
  }

  return (
    <div id="newItemPage" className="d-flex flex-column align-items-center  container pb-5 defaultPageLayout">
      <Container className="bg-white p-0 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
        <div className="text-center bg-primary py-3 rounded-top">
          <h1 className="text-white">New Listing</h1>
        </div>

        <div className="p-4">
          <Form>
            <Form.Group controlId="input-name">
              <Form.Label>Name: <span className='text-danger'>*</span></Form.Label>
              <Form.Control type="text" name="message" minLength={2} />
              {nameError && <Alert variant="danger mt-2">{nameError}</Alert>}
            </Form.Group>
            <Form.Group controlId="input-description" className="mt-1">
              <Form.Label>Description: <span className='text-danger'>*</span></Form.Label>
              <Form.Control type="text" name="message" minlength="3" />
              {descriptionError && <Alert variant="danger mt-2">{descriptionError}</Alert>}
            </Form.Group>
            <Form.Group controlId="input-price" className="mt-1">
              <Form.Label>Price per day: <span className='text-danger'>*</span></Form.Label>
              <Form.Control type="text" name="message" />
              {priceError && <Alert variant="danger mt-2">{priceError}</Alert>}
            </Form.Group>
            <Form.Group controlId="input-location" className="mt-1">
              <Form.Label>Location: <span className='text-danger'>*</span></Form.Label>
              <Form.Control
                as="select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {verifiedBusiness ? (
              <Form.Group controlId="input-external-url" className="mt-1">
                <Form.Label>External Url:</Form.Label>
                <Button variant="link" className='mb-1 mr-2' onClick={handleOpenModal}>
                  Find out more
                </Button>
                <Form.Control type="text" name="message" />
                {externalUrlError && <Alert variant="danger mt-2">{externalUrlError}</Alert>}
              </Form.Group>
            ) : null}
            <Form.Group controlId="input-image" className="mt-1">
              <Form.Label>Image: <span className='text-danger'>*</span></Form.Label>
              <Form.Control type="file" name="message" />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={postNewItem} disabled={isLoading || !user.seller_verified || !user.stripe_account}>
              {isLoading ? "Loading..." : "Create Listing"}
            </Button>

            {!user.seller_verified && <p className="text-danger mt-2">Please become a verified seller to post items. <a href="/profile" className="text-danger">Become one here!</a></p>}
            {error && <p className="text-danger mt-2">{error}</p>}
          </Form>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>External URL Feature</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                The "External URL" feature is available exclusively for business accounts. It allows you to link to an external website or resource. Please note the following:
              </p>
              <ul>
                <li>
                  Each click on your external link will incur a cost, and you will be sent a bill for these clicks.
                </li>
                <li>
                  This feature also signifies that your business is verified.
                </li>
                <li>
                  Please note that you can only use the domain you provided when registering your business *You Can Update This*
                </li>
              </ul>
              <p>
                By using the "External URL" feature, you can drive traffic to your external site while maintaining the status of a verified business.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </Container>
    </div>
  );
}

export default NewItem;
