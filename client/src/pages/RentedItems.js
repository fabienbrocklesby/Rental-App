import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

function RentedItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/items/get/byholder')
      .then(response => response.json())
      .then(items => setItems(items));
  }, []);

  return (
    <div className="itemsPage">
      <Header />
      <div className="container">
        <h1 className="my-4">Rented Items</h1>
        {items.length === 0 ? (
          <p>No items rented yet</p>
        ) : (
          <div className="row">
            {items.map(item => (
              <div key={item.id} className="col-md-4 mb-4">
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
                    <button
                      className="btn btn-primary"
                      onClick={() => (window.location.href = `/return/${item.id}`)}
                    >
                      Return Item
                    </button>
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
