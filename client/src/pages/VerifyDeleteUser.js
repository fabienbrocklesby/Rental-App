import Header from "../components/Header";

function register() {

  async function verifyUserDelete() {
    const otp = document.getElementById("input-otp").value;
    
    const response = await fetch('http://localhost:3001/api/users/verifydelete', {
      method: 'DELETE',
      body: JSON.stringify({ otp }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
    })

    console.log(await response.json())
  }

  return (
    <div id="registerPage">
      <Header />
      <h1>Verify Delete User</h1>
      
      <label for="input-otp">OTP:</label>
      <input type="text" id="input-otp"  name="message" />
      
      <button onClick={verifyUserDelete}>Verify Delete</button>
    </div>
  )
}

export default register;