import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Header from '../components/Header.js';

function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/items')
      .then(response => response.json())
      .then(items => setItems(items));
  }, []);

  return (
    <div className="container">
      <Header />
      <h1 className="my-4">Items Page</h1>
      <div className="row">
        {items.length === 0 ? (
          <p>No items yet</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card h-100">
                {document.cookie || localStorage.getItem('userId') ? ( 
                  <Link to={'/items/' + item.id}>
                    <img
                      src={`/uploads/${item.img_dir}`}
                      className="card-img-top item-image"
                      alt={item.name}
                    />
                  </Link>
                ) : (
                  <div>
                    <img
                      src={`/uploads/${item.img_dir}`}
                      className="card-img-top item-image"
                      alt={item.name}
                    />
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">${item.price}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Items;
