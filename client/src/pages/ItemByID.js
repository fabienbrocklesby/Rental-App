import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import '../css/Home.css';
import Header from '../components/Header.js';

function ItemByID() {
  const [item, setItem] = useState({});
  let { id } = useParams();

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(response => response.json())
      .then(item => setItem(item));
  }, {});

  return (
    <div className="itemsPage">
      <Header />
      <h1>Item By ID Page</h1>
      <h2>{item.title}</h2>
      <p>{item.body}</p>
    </div>
  );
}

export default ItemByID;
