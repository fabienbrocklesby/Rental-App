import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import '../css/Home.css';

import loggedInStatus from '../Functions/checkLoggedInStatus.js';
const CartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="currentColor"
    className="bi bi-bag"
    viewBox="0 0 15 18"
    alt="cart"
  >
    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
  </svg>

);

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

  const isLoggedIn = loggedInStatus();

  useEffect(() => {
    if (isLoggedIn) {
      async function fetchCartItems() {
        try {
          const response = await fetch("/api/items/cart", {
            method: "GET",
            credentials: "include",
          });

          if (response.ok) {
            const cartData = await response.json();
            setCartItems(cartData || []);
          } else {
            console.error("An error occurred while fetching cart items:", response.statusText);
          }
        } catch (error) {
          console.error("An error occurred while fetching cart items:", error);
        }
      }

      fetchCartItems();
    }
  }, [isLoggedIn]);

  return (
    <>
      <div id="topofpage" style={{ position: "relative", top: "-100vh" }}></div>
      <div className="App">
        <Navbar bg="light" expand="lg" expanded={navbarExpanded} onToggle={handleNavToggle} className="sticky-top navbar">
          <div className="container d-flex justify-content-between align-items-center">
            <Navbar.Brand>
              <a href="/" className="nav-link home-link">
                <img src="/images/Logo.png" alt="logo" className="d-inline-block align-top mb-1" style={{ height: "50px" }} />
              </a>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarNav" />
            <Navbar.Collapse id="navbarNav">
              <Nav className="ms-auto links">
                {!isLoggedIn ? (
                  <>
                    <a href="/" onClick={handleNavCollapse}>
                      Home
                    </a>
                    <a href="/register" onClick={handleNavCollapse}>
                      Register
                    </a>
                    <a href="/login" onClick={handleNavCollapse}>
                      Login
                    </a>
                    <a href="/verifyotp" onClick={handleNavCollapse}>
                      Verify OTP
                    </a>
                    <a href="/items" onClick={handleNavCollapse}>
                      All items
                    </a>
                  </>
                ) : (
                  <>
                    <NavDropdown title="Items" id="itemsDropdown">
                      <a href="/items" class="dropdown-item" onClick={handleNavCollapse}>
                        Browse Listings
                      </a>
                      <a href="/newitem" class="dropdown-item" onClick={handleNavCollapse}>
                        New Listing
                      </a>
                      <a href="/renteditems" class="dropdown-item" onClick={handleNavCollapse}>
                        Rented Items
                      </a>
                      <a href="/listings" class="dropdown-item" onClick={handleNavCollapse}>
                        My Listings
                      </a>
                    </NavDropdown>
                    <NavDropdown title="Profile" id="profileDropdown">
                      <a href="/profile" class="dropdown-item" onClick={handleNavCollapse}>
                        View profile
                      </a>
                      <a href="/logout" class="dropdown-item" onClick={handleNavCollapse}>
                        Logout
                      </a>
                    </NavDropdown>
                    <NavDropdown title={<>{CartIcon} ({cartItems.length}) </>} id="cartDropdown">
                      {cartItems.length === 0 ? (
                        <NavDropdown.Item disabled>Nothing in cart yet</NavDropdown.Item>
                      ) : (
                        cartItems.map((item, index) => (
                          <a key={index} href={`/items/${item.id}`} onClick={handleNavCollapse}>
                            {item.name}
                          </a>
                        ))
                      )}
                    </NavDropdown>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>

        <div className="mt-4">
          <Outlet />
          <div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
