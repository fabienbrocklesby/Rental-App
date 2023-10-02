import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Dropdown, DropdownButton } from "react-bootstrap";

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
    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
  </svg>

);

const DeleteCartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="currentColor"
    className="bi bi-bag"
    viewBox="0 0 15 18"
    alt="cart"
  >
    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
  </svg>
);

const DeleteCartIconFilled = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="currentColor"
    className="bi bi-bag"
    viewBox="0 0 15 18"
    alt="cart"
  >
    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
  </svg>
)

import Footer from "../components/Footer";

const Layout = () => {
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  // const [isDeleteIconFilled, setIsDeleteIconFilled] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);


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
            console.log(cartData)
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

  const handleDeleteItem = (itemId, cartId) => {
    fetch(`/api/items/reset/cart/${cartId}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete item from cart');
        }
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteIconMouseEnter = (itemId) => {
    setHoveredItemId(itemId);
  };

  const handleDeleteIconMouseLeave = () => {
    setHoveredItemId(null);
  };

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
                    <NavDropdown
                      align="end"
                      title={<>{CartIcon} ({cartItems.length}) </>}
                      id="cartDropdown"
                      className="dropdown"
                      variant="link"
                    >
                      {cartItems.length === 0 ? (
                        <Dropdown.Item disabled>Nothing in cart yet</Dropdown.Item>
                      ) : (
                        cartItems.map((item, index) => (
                          <Dropdown.Item key={index} className="dropdown-item d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center flex-grow-1" onClick={() => { window.location.href = `/items/${item.id}`; handleNavCollapse }}>
                              {item.name}
                            </div>
                            <div className="d-flex align-items-center" onClick={() => handleDeleteItem(item.id, item.cartId)}>
                              {hoveredItemId === item.id ? (
                                <div
                                  onMouseEnter={() => handleDeleteIconMouseEnter(item.id)}
                                  onMouseLeave={() => handleDeleteIconMouseLeave()}
                                >
                                  {DeleteCartIconFilled}
                                </div>
                              ) : (
                                <div
                                  style={{ cursor: 'pointer' }}
                                  onMouseEnter={() => handleDeleteIconMouseEnter(item.id)}
                                  onMouseLeave={() => handleDeleteIconMouseLeave()}
                                >
                                  {DeleteCartIcon}
                                </div>
                              )}
                            </div>
                          </Dropdown.Item>
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
