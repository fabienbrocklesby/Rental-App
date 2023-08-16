import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const Layout = () => {
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const [cartItems, setCartItems] = useState([]);

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

  useEffect(() => {
    async function fetchCartItems() {
      try {
        const response = await fetch("http://localhost:3001/api/items/cart", {
          method: "GET",
          credentials: "include",
        });

        const cartData = await response.json();
        setCartItems(cartData || []);
      } catch (error) {
        console.error("An error occurred while fetching cart items:", error);
      }
    }

    fetchCartItems();
  }, []);

  return (
    <>
      <Navbar bg="light" expand="lg" expanded={navbarExpanded} onToggle={handleNavToggle} className="sticky-top">
        <div className="container">
          <div className="d-flex align-items-center">
            <Navbar.Brand as={Link} to="/">
              <img src="/images/Logo.png" alt="logo" className="d-inline-block align-top w-25 mb-1" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav" className="ms-auto" />
          </div>
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
                      Browse Listings
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/newitem" onClick={handleNavCollapse}>
                      New Listing
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/renteditems" onClick={handleNavCollapse}>
                      Rented Items
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/listings" onClick={handleNavCollapse}>
                      My Listings
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title="Profile" id="profileDropdown">
                    <NavDropdown.Item as={Link} to="/profile" onClick={handleNavCollapse}>
                      View profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/logout" onClick={handleNavCollapse}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown title={`My Cart (${cartItems.length})`} id="cartDropdown">
                    {cartItems.map((item, index) => (
                      <NavDropdown.Item key={index} as={Link} to={`/items/${item.id}`} onClick={handleNavCollapse}>
                        {item.name}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      <div className="pt-4">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
