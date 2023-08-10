import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../css/Home.css';

function ProfilePage() {
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
    <div className="profilePage">
      <Container>
        <Row className="justify-content-center rounded align-items-center bg-light p-5">
          <Col xs="auto" className="text-center">
            <h2>Username: {user.username}</h2>
            <h3>Email: {user.email}</h3>
            {localStorage.getItem('userId') === user.id ? (
              <>
                <Button variant="primary" className="mx-1" onClick={() => window.location.href = `/updateuser`}>
                  Update User
                </Button>
                <Button variant="danger" className="mx-1" onClick={() => window.location.href = `/reqdeleteuser`}>
                  Delete User
                </Button>
              </>
            ) : null}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProfilePage;
