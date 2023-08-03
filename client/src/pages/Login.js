import Header from "../components/Header";

function register() {

  async function registerUser() {
    const email = document.getElementById("input-email").value;
    
    const response = await fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    if (response.ok) {
      localStorage.setItem('email', email);
      window.location.href = '/verifyotp';
    }
    
    console.log(await response.json())
  }

  return (
    <div id="registerPage">
      <Header />
      <h1>Login</h1>

      <input type="email" id="input-email" name="message" />
      
      <button onClick={registerUser}>Login</button>
    </div>
  )
}

export default register;