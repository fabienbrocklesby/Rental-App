import '../css/Home.css';
import Header from '../components/Header.js';

function NewItem() {
  async function postNewItem() {
    const name = document.getElementById("input-name").value;
    const description = document.getElementById("input-description").value;
    const price = document.getElementById("input-price").value;
    const image = document.getElementById("input-image");
    const imageFile = image.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", imageFile);

    const response = await fetch('http://localhost:3001/api/items/create', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    if (response) {
      console.log(await response.json());
    }
  }

  return (
    <div className="newItemPage">
      <Header />
      <h1>New Item</h1>
      <label for="input-name">Name:</label>
      <input type="text" id="input-name" name="message" /><br />
      <label for="input-description">Description:</label>
      <input type="text" id="input-description" name="message" /><br />
      <label for="input-price">Price:</label>
      <input type="text" id="input-price" name="message" /><br />
      <label for="input-image">Image:</label>
      <input type="file" id="input-image" name="message" /><br />

      <button onClick={postNewItem}>Post Item</button>
    </div>
  );
}

export default NewItem;
