import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import '../css/Home.css';
import Header from '../components/Header.js';

function Items() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/items')
      .then((response) => response.json())
      .then((items) => setItems(items));
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fuse = new Fuse(items, {
    keys: ['name'],
    threshold: 0.3,
  });

  const filteredItems = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : items;

  return (
    <div className="itemsPage">
      <Header />
      <div className="container">
        <h1 className="my-4">Items Page</h1>
        <div className="searchBar mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search items by name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="row">
          {filteredItems.length === 0 ? (
            <p>No items found</p>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <a href={'items/' + item.id}>
                    <img
                      src={`/uploads/${item.img_dir}`}
                      className="card-img-top item-image"
                      alt={item.name}
                    />
                  </a>
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
    </div>
  );
}

export default Items;
