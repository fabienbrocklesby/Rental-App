import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import '../css/Home.css';
import Header from '../components/Header.js';
import AddToCart from '../components/AddToCart.js';
import ReqPurchase from '../components/RequestPurchase.js';

function ItemByID() {
  const [item, setItem] = useState({});
  let { id } = useParams();

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
      <AddToCart itemId={item.id} />
      <ReqPurchase itemId={item.id} />
      <h2>Name: {item.name}</h2>
      <h3>Description: {item.description}</h3>
      <h4>Price: ${item.price}</h4>
      <img src={`/uploads/${item.img_dir}`} alt={item.name} />
    </div>
  );
}

export default ItemByID;
