import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);

  const handleLinkClick = () => {
    setNavbarCollapsed(true);
  };

  let isLoggedIn = false;

  if (document.cookie.includes("access_token")) {
    isLoggedIn = true;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            EZGear
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setNavbarCollapsed(!navbarCollapsed)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className={`collapse navbar-collapse ${navbarCollapsed ? '' : 'show'}`} id="navbarNav">
            <ul className='navbar-nav ms-auto'>
              {/* Unlocked Routes */}
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={handleLinkClick}>
                  Home
                </Link>
              </li>
              {/* Conditional Routes */}
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register" onClick={handleLinkClick}>
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" onClick={handleLinkClick}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/verifyotp" onClick={handleLinkClick}>
                      Verify OTP
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/items" onClick={handleLinkClick}>
                      All Items
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="itemsDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Items
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="itemsDropdown"
                  >
                    <Link className="dropdown-item" to="/items" onClick={handleLinkClick}>
                      All Items
                    </Link>
                    <Link className="dropdown-item" to="/newitem" onClick={handleLinkClick}>
                      New Item
                    </Link>
                    <Link className="dropdown-item" to="/renteditems" onClick={handleLinkClick}>
                      Rented Items
                    </Link>
                    <Link className="dropdown-item" to="/searchbar" onClick={handleLinkClick}>
                      Search Items
                    </Link>
                    <Link className="dropdown-item" to="/listings" onClick={handleLinkClick}>
                      Listings
                    </Link>
                  </div>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile" onClick={handleLinkClick}>
                      Profile
                    </Link>
                  </li>
                 
                  <li className="nav-item">
                    <Link className="nav-link" to="/logout" onClick={handleLinkClick}>
                      Logout
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
