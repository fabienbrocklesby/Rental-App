function addToCart({ itemId }) {

  async function addToCart() {
    const response = await fetch('http://localhost:3001/api/items/purchase', {
      method: 'POST',
      body: JSON.stringify({ itemId }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })

    console.log(await response.json())
  }

  return (
    <div>
      <h1>Request Purchase</h1>
      <button onClick={addToCart}>Request Purchase</button>
    </div>
  )
}

export default addToCart;