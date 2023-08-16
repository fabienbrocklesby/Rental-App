import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import '../css/Home.css';

function Items() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [sortAscending, setSortAscending] = useState(false);

  let loggedIn = false;

  if (localStorage.getItem('userId') && document.cookie) {
    loggedIn = true
  }

  useEffect(() => {
    fetch('http://localhost:3001/api/items')
      .then(response => response.json())
      .then(items => {
        if (showAvailableOnly) {
          setItems(items.filter(item => item.available && !item.cart_id));
        } else {
          setItems(items);
        }
      });
  }, [showAvailableOnly]);

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleCheckboxChange = () => {
    setShowAvailableOnly(!showAvailableOnly);
  };

  const handleSortChange = () => {
    setSortAscending(!sortAscending);
  };

  const fuse = new Fuse(items, {
    keys: ['name', 'description'],
    threshold: 0.4,
  });

  const filteredItems = searchQuery
    ? fuse.search(searchQuery).map(result => result.item)
    : items;

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortAscending) {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  return (
    <div className="itemsPage">
      <div className="bg-primary custom-bottom-margin mw-100 text-white py-4">
        <div className="container">
          <h1 className="my-4">All Listings</h1>
          <div className="searchBar mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search items by name or description..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="mb-4">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={handleCheckboxChange}
              />
              <span className="ms-1">Available Items Only</span>
            </label>
            <label className="custom-checkbox ms-4">
              <input
                type="checkbox"
                checked={sortAscending}
                onChange={handleSortChange}
              />
              <span className="ms-1">Sort by Lowest Price</span>
            </label>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div class="itemsList">
          <div className="row">
            {sortedItems.length === 0 ? (
              <p>No items found</p>
            ) : (
              sortedItems.map(item => (
                <div key={item.id} className="col-md-4 mb-4">
                  <div className="card h-100">
                    {loggedIn === true ? (
                      <a href={'items/' + item.id}>
                        <img
                          src={`/uploads/${item.img_dir}`}
                          className="card-img-top item-image"
                          alt={item.name}
                        />
                      </a>
                    ): (
                      <img
                        src={`/uploads/${item.img_dir}`}
                        className="card-img-top item-image"
                        alt={item.name}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">${item.price} / day</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Items;
