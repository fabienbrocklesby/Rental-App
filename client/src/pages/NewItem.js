import '../css/Home.css';
import Header from '../components/Header.js';


function NewItem() {
  async function postNewItem() {
    const title = document.getElementById("input-title").value;
    const body = document.getElementById("input-body").value;

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ title, body }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
  }


  return (
    <div className="newItemPage">
      <Header />
      <h1>New Item</h1>
      <input type="text" id="input-title" name="message" />
      <input type="text" id="input-body" name="message" />

      <button onClick={postNewItem}>Post Item</button>
    </div>
  );
}

export default NewItem;
