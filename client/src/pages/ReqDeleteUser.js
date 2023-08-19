import React from 'react';
import { Button, Container } from 'react-bootstrap';

function ReqDeleteUser() {
  async function DeleteUser() {
    const response = await fetch('/api/users/delete', {
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
    <div id="deleteUserPage" className="min-vh-100 d-flex flex-column align-items-center py-5">
      <Container className="bg-white p-4 rounded shadow-sm" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Delete User</h1>

        <div className="text-center">
          <Button variant="danger" onClick={DeleteUser}>Delete User</Button>
        </div>
      </Container>
    </div>
  );
}

export default ReqDeleteUser;
