import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import Footer from "../components/Footer";

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

  if (document.cookie.includes("access_token") && localStorage.getItem("userId")) {
    isLoggedIn = true;
  }

  if (isLoggedIn) {
    useEffect(() => {
      async function fetchCartItems() {
        try {
          const response = await fetch("/api/items/cart", {
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
  }

  return (
    <>
      <Navbar bg="light" expand="lg" expanded={navbarExpanded} onToggle={handleNavToggle} className="sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          <Navbar.Brand>
            <Link to="/" className="nav-link">
              <img src="/images/Logo.png" alt="logo" className="d-inline-block align-top mb-1" style={{ height: "50px" }} />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto">
              {!isLoggedIn ? (
                <>
                  <Nav.Link as={Link} to="/" onClick={handleNavCollapse}>
                    Home
                  </Nav.Link>
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
                    {cartItems.length === 0 ? (
                      <NavDropdown.Item disabled>Nothing in cart yet</NavDropdown.Item>
                    ) : (
                      cartItems.map((item, index) => (
                        <NavDropdown.Item key={index} as={Link} to={`/items/${item.id}`} onClick={handleNavCollapse}>
                          {item.name}
                        </NavDropdown.Item>
                      ))
                    )}
                  </NavDropdown>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>

      <div className="pt-4">
        <Outlet />
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
