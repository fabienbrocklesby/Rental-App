import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import '../css/Home.css';

function Items() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [sortAscending, setSortAscending] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  const locations = [
    "Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin",
    "Palmerston North", "Napier", "Hastings", "Nelson", "Rotorua", "New Plymouth",
    "Whangārei", "Invercargill", "Whanganui", "Gisborne", "Wanganui", "Taranaki",
    "Manawatu-Wanganui", "Bay of Plenty", "Northland", "Waikato", "Wellington",
    "Canterbury", "Otago", "Southland", "Hawke's Bay", "Marlborough", "West Coast"
  ];

  useEffect(() => {
    fetch('/api/items')
      .then(response => response.json())
      .then(items => setItems(items));
  }, []);

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = () => {
    setSortAscending(!sortAscending);
  };

  const handleLocationCheckboxChange = () => {
    setShowLocationDropdown(!showLocationDropdown);
  };

  const handleLocationSelect = event => {
    setSelectedLocation(event.target.value);
  };

  const fuse = new Fuse(items, {
    keys: [
      {
        name: 'name',
        weight: 0.7,
      },
      {
        name: 'description',
        weight: 0.3,
      },
    ],
    threshold: 0.4,
    tokenize: false,
    shouldSort: true,
    includeMatches: true,
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

  const locationFilteredItems = selectedLocation
    ? sortedItems.filter(item => item.location === selectedLocation)
    : sortedItems;


  function countClick(itemId) {
    console.log(itemId)
    fetch(`/api/items/count/${itemId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="itemsPage mb-5">
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
            <div className="d-flex flex-wrap flex-column flex-md-row align-items-md-center">
              <label className="custom-checkbox mb-2 mb-md-0 me-md-4">
                <input
                  type="checkbox"
                  checked={sortAscending}
                  onChange={handleSortChange}
                />
                <span className="ms-1">Sort by Lowest Price</span>
              </label>
              <label className="custom-checkbox mb-2 mb-md-0 me-md-4">
                <input
                  type="checkbox"
                  checked={showLocationDropdown}
                  onChange={handleLocationCheckboxChange}
                />
                <span className="ms-1">Filter By Location</span>
              </label>
            </div>
            <div className="d-flex flex-wrap flex-column flex-md-row align-items-md-center">
              {showLocationDropdown && (
                <div className="mt-3">
                  <select
                    className="form-select"
                    value={selectedLocation}
                    onChange={handleLocationSelect}
                  >
                    <option value="">Select Location</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="itemsList">
          <div className="row">
            {locationFilteredItems.length === 0 ? (
              <p>No items found</p>
            ) : (
              locationFilteredItems.map(item => (
                <div key={item.id} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <a
                      href={item.external_url ? item.external_url : `items/${item.id}`}
                      onClick={(e) => {
                        if (item.external_url) {
                          countClick(item.id);
                        }
                      }}
                    >
                      <img
                        src={`/uploads/${item.img_dir}`}
                        className="card-img-top item-image taller-image"
                        alt={item.name}
                      />
                    </a>
                    <div className="card-body">
                      {item.external_url && (
                        <span className="badge bg-primary mb-2" data-bs-toggle="tooltip" data-bs-placement="top" title="This link goes to another website. Verified by our team.">
                          Visit Website
                        </span>
                      )}
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
