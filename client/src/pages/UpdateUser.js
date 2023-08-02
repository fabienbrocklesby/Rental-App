import Header from "../components/Header";

function register() {

  async function registerUser() {
    const newUsername = document.getElementById("input-username").value;
    const email = document.getElementById("input-email").value;
    
    const response = await fetch('http://localhost:3001/api/users/requpdate', {
      method: 'POST',
      body: JSON.stringify({ newUsername, email }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    console.log(await response.json())
  }

  return (
    <div id="registerPage">
      <Header />
      <h1>Update</h1>

      <label for="input-username">Username:</label>
      <input type="text" id="input-username" name="message" />
      <label for="input-email">Email:</label>
      <input type="email" id="input-email" name="message" />
      
      <button onClick={registerUser}>Update User</button>
    </div>
  )
}

export default register;