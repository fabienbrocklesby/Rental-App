import { useState, useEffect } from 'react';
import '../css/Home.css';
import Header from '../components/Header.js';

function profilePage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/api/users/get/email', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(user => setUser(user))
      .catch(error => console.log(error))
  }, []);

  return (
    <div className="itemsPage">
      <Header />
      <h2>Username: {user.username}</h2>
      <h3>Email: {user.email}</h3>

      {localStorage.getItem('userId') === user.id ? (
        <>
          <button onClick={() => window.location.href = `/updateuser`}>Update User</button>
          <button onClick={() => window.location.href = `/reqdeleteuser`}>Delete User</button>
        </>
      ): null}
    </div>
  );
}

export default profilePage;
