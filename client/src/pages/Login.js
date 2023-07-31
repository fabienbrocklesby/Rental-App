import Header from "../components/Header";

function register() {

  async function registerUser() {
    const email = document.getElementById("input-email").value;
    const otp = document.getElementById("input-otp").value;
    
    const response = await fetch('http://localhost:3001/api/users/verifyotp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    console.log(await response.json())
  }

  return (
    <div id="registerPage">
      <Header />
      <h1>Login</h1>

      <input type="email" id="input-email" name="message" />
      <input type="text" id="input-otp" name="message" />
      
      <button onClick={registerUser}>Register</button>
    </div>
  )
}

export default register;