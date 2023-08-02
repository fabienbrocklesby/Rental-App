import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/items">Items</Link></li>
          <li><Link to="/newitem">New Item</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/verifyotp">Verify OTP</Link></li>
          <li><Link to="/updateitem">Update Item</Link></li>
          <li><Link to="/updateuser">Update User</Link></li>
          <li><Link to="/verifyuserupdate">Verify Update</Link></li>
          <li><Link to="/return">Req Item Return</Link></li>
          <li><Link to="/receipt">Req Item Receipt</Link></li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;