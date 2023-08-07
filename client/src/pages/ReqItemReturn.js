import { useParams } from 'react-router-dom';
import '../css/Home.css';
import Header from '../components/Header.js';

function ReturnItem() {
  const { id } = useParams();

  async function postNewItem() {

    const response = await fetch('http://localhost:3001/api/items/return', {
      method: 'POST',
      body: JSON.stringify({ itemId: id}),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    });

    if (response) {
      console.log(await response.json());
    }
  }

  return (
    <div className="newItemPage">
      <Header />
      <h1>Return Item</h1>

      <button onClick={postNewItem}>Return Item</button>
    </div>
  );
}

export default ReturnItem;
