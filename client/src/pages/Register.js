import Header from "../components/Header";

function register() {

  async function registerUser() {
    const username = document.getElementById("input-username").value;
    const email = document.getElementById("input-email").value;
    
    const response = await fetch('http://localhost:3001/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    console.log(await response.json())
  }

  return (
    <div id="registerPage">
      <Header />
      <h1>Register</h1>

      <input type="text" id="input-username" name="message" />
      <input type="email" id="input-email" name="message" />
      
      <button onClick={registerUser}>Register</button>
    </div>
  )
}

export default register;