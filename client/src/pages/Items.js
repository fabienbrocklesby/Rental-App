import { useState, useEffect } from 'react';
import '../css/Home.css';
import Header from '../components/Header.js';

function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(items => setItems(items));
  }, []);

  return (
    <div className="itemsPage">
      <Header />
      <h1>Items Page</h1>
      <ul>
        {items.map(item => <li><a href={'items/' + item.id}>{item.title}</a></li>)}
      </ul>
    </div>
  );
}

export default Items;
