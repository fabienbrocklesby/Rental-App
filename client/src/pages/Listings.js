import { useState, useEffect } from 'react';
import '../css/Home.css';

function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/items/user/email', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(items => setItems(items));
  }, []);

  return (
    <div className="itemsPage">
      <div className="container">
        <h1 className="my-4">My Listings</h1>
        {items.length === 0 ? (
          <p>No items yet</p>
        ) : (
          <div className="row">
            {items.map(item => (
              <div key={item.id} className="col-md-3 mb-4">
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
                    </div>
                  </div>
                  <div className="card-footer">
                    <a href={'items/' + item.id} className="btn btn-primary">
                      View Details
                    </a>
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

export default Items;
