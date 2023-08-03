import { useParams } from 'react-router-dom';

import '../css/Home.css';
import Header from '../components/Header.js';

function DeleteItem() {
  const { id } = useParams();

  console.log(id)

  async function confirmDelete() {
    const response = await fetch('http://localhost:3001/api/items/delete', {
      method: 'DELETE',
      body: JSON.stringify({ itemId: id }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    });

    if (response) {
      window.location.href = '/items';
    }
  }

  return (
    <div className="newItemPage">
      <Header />
      <h1>Delete Item</h1>

      <button onClick={confirmDelete}>Delete Item</button>
    </div>
  );
}

export default DeleteItem;
