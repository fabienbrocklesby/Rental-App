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
      <h1>Items Page</h1>
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search items by name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {filteredItems.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ul>
          {filteredItems.map((item) => (
            <li key={item.id}>
              <a href={'items/' + item.id}>{item.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Items;
