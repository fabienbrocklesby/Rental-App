import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const Layout = () => {
  const [navbarExpanded, setNavbarExpanded] = useState(false);

  const handleNavToggle = () => {
    setNavbarExpanded(!navbarExpanded);
  };

  const handleNavCollapse = () => {
    setNavbarExpanded(false);
  };

  let isLoggedIn = false;

  if (document.cookie.includes("access_token")) {
    isLoggedIn = true;
  }

  return (
    <>
      <Navbar bg="light" expand="lg" expanded={navbarExpanded} onToggle={handleNavToggle}>
        <div className="container">
          <Navbar.Brand as={Link} to="/">
            EZGear
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" onClick={handleNavCollapse}>
                Home
              </Nav.Link>
              {!isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/register" onClick={handleNavCollapse}>
                    Register
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login" onClick={handleNavCollapse}>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/verifyotp" onClick={handleNavCollapse}>
                    Verify OTP
                  </Nav.Link>
                  <Nav.Link as={Link} to="/items" onClick={handleNavCollapse}>
                    All Items
                  </Nav.Link>
                </>
              ) : (
                <>
                  <NavDropdown title="Items" id="itemsDropdown">
                    <NavDropdown.Item as={Link} to="/items" onClick={handleNavCollapse}>
                      All Items
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/newitem" onClick={handleNavCollapse}>
                      New Item
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/renteditems" onClick={handleNavCollapse}>
                      Rented Items
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/searchbar" onClick={handleNavCollapse}>
                      Search Items
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/listings" onClick={handleNavCollapse}>
                      Listings
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link as={Link} to="/profile" onClick={handleNavCollapse}>
                    Profile
                  </Nav.Link>
                  <Nav.Link as={Link} to="/logout" onClick={handleNavCollapse}>
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      <div className="container py-4">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
