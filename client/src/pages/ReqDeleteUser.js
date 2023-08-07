import '../css/Home.css';
import Header from '../components/Header.js';

function ReqDeleteUser() {
  async function DeleteUser() {

    const response = await fetch('http://localhost:3001/api/users/delete', {
      method: 'DELETE',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      credentials: 'include',
    });

    if (response) {
      window.location.href = `/verifydeleteuser`;
    }
  }

  return (
    <div className="newItemPage">
      <Header />
      <h1>Delete User</h1>

      <button onClick={DeleteUser}>Delete User</button>
    </div>
  );
}

export default ReqDeleteUser;
