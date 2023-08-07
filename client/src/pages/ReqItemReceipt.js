import { useParams } from 'react-router-dom';

import '../css/Home.css';
import Header from '../components/Header.js';

function ReceiptItem() {
  const { id } = useParams();

  async function postNewItem() {
    const response = await fetch('http://localhost:3001/api/items/receipt', {
      method: 'POST',
      body: JSON.stringify({ itemId: id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    });

    if (response) {
      window.location.href = `/items/${id}`;
    }
  }

  return (
    <div className="newItemPage">
      <Header />
      <h1>Receipt Item</h1>

      <button onClick={postNewItem}>Receipt Item</button>
    </div>
  );
}

export default ReceiptItem;
