import { useState, useEffect } from 'react';
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
      <h1>Items Page</h1>
      {items.length === 0 ? (
        <p>No items yet</p>
      ) : (
        <ul>
          {items.map(item => (
            <>
              <li key={item.id}>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
              </li>
              <button onClick={() => window.location.href = `/return/${item.id}`}>Return Item</button>
            </>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RentedItems;