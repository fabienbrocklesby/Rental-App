import { Outlet, Link } from "react-router-dom";

let isLoggedIn = false;

if (document.cookie.includes("access_token")) {
  isLoggedIn = true;
}

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          {/* Unlocked Routes */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/items">Items</Link></li>

          {/* Conditional Routes */}
          {!isLoggedIn ? (
            <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/verifyotp">Verify OTP</Link></li>
            </>
          ): null}

          {/* Locked Routes */}
          {isLoggedIn ? (
            <>
              <li><Link to="/newitem">New Item</Link></li>
              <li><Link to="/updateitem">Update Item</Link></li>
              <li><Link to="/updateuser">Update User</Link></li>
              <li><Link to="/verifyuserupdate">Verify Update</Link></li>
              <li><Link to="/return">Req Item Return</Link></li>
              <li><Link to="/receipt">Req Item Receipt</Link></li>
              <li><Link to="/deleteitem">Delete Item</Link></li>
              <li><Link to="/reqdeleteuser">Req Delete User</Link></li>
              <li><Link to="/verifydeleteuser">Verify Delete User</Link></li>
            </>
          ): null}
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;