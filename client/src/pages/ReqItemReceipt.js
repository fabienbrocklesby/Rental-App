import '../css/Home.css';
import Header from '../components/Header.js';

function NewItem() {
  async function postNewItem() {
    const itemId = document.getElementById("input-ID").value;

    const response = await fetch('http://localhost:3001/api/items/receipt', {
      method: 'POST',
      body: JSON.stringify({ itemId }),
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
      <h1>Receipt Item</h1>
      <label for="input-name">Item ID:</label>
      <input type="text" id="input-ID" name="message" /><br />

      <button onClick={postNewItem}>Receipt Item</button>
    </div>
  );
}

export default NewItem;
