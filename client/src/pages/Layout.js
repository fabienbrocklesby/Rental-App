import { Outlet, Link } from "react-router-dom";

let isLoggedIn = false;

if (document.cookie.includes("access_token")) {
  isLoggedIn = true;
}

const Layout = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <ul className="navbar-nav mr-auto">
            {/* Unlocked Routes */}
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/items">Items</Link></li>

            {/* Conditional Routes */}
            {!isLoggedIn ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/verifyotp">Verify OTP</Link></li>
              </>
            ) : null}

            {/* Locked Routes */}
            {isLoggedIn ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/newitem">New Item</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/renteditems">Rented Items</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/listings">Listings</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/searchbar">Search Items</Link></li>
              </>
            ) : null}
          </ul>
        </div>
      </nav>

      <div className="container py-4">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
