import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../css/Home.css';

function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items/user/email', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(items => setItems(items));
  }, []);

  return (
    <div className="listingsPage">
      <div className="bg-primary mw-100 text-white py-4 custom-bottom-margin">
        <h1 className="my-4 container">My Listings</h1>
      </div>
      <div className="container mt-4">
        {items.length === 0 ? (
          <span>
            <h4>You haven't listed any items yet .. </h4>
            <h5>
              <Link as={Link} to="/newitem" className="text-decoration-none text-primary">
                List one here!
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
                      {item.external_url && (
                        <span className="badge bg-primary mb-2" data-bs-toggle="tooltip" data-bs-placement="top" title="This listing leads to another website">
                          External Listing
                        </span>
                      )}
                      {item.holder_id && (<h6 className="text-success">This item is currently rented</h6>)}
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
