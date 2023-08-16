import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function RentedItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/items/get/byholder')
      .then(response => response.json())
      .then(items => setItems(items));
  }, []);

  return (
    <div className="itemsPage ">
      <div className="bg-primary mw-100 text-white py-4 custom-bottom-margin">
        <h1 className="my-4 container">Rented Items</h1>
      </div>
      <div className="container mt-4">
        {items.length === 0 ? (
          <span>
            <h4>You haven't rented any items yet .. </h4>
            <h5>
              <Link as={Link} to="/items" className="text-decoration-none text-primary">
                Check out some cool listings here!
              </Link>
            </h5>
          </span>
        ) : (
          <div className="row">
            {items.map(item => (
              <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card h-100">
                  <div className="d-flex p-2 align-items-center">
                    <img
                      src={`/uploads/${item.img_dir}`}
                      alt={item.name}
                      className="card-img-top ms-2 img-thumbnail"
                      style={{ width: '100px', height: '100px' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">{item.description}</p>
                    </div>
                  </div>
                  <div className="card-footer">
                    {item.return_status === 'pending' ? (
                      <button
                        className="btn btn-secondary"
                        disabled
                      >
                        Return Pending
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => (window.location.href = `/return/${item.id}`)}
                      >
                        Return Item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RentedItems;
