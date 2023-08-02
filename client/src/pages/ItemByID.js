import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import '../css/Home.css';
import Header from '../components/Header.js';

function ItemByID() {
  const [item, setItem] = useState({});
  let { id } = useParams();

  console.log(id)

  useEffect(() => {
    fetch(`http://localhost:3001/api/items/${id}`)
      .then(response => response.json())
      .then(item => setItem(item))
      .catch(error => console.log(error))
  }, [id]);

  return (
    <div className="itemsPage">
      <Header />
      <h1>Item By ID Page</h1>
      <h2>{item.name}</h2>
    </div>
  );
}

export default ItemByID;
