import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import PageNotFound from './pages/PageNotFound';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Items from './pages/Items';
import ItemByID from './pages/ItemByID';
import NewItem from './pages/NewItem';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import UpdateItem from './pages/UpdateItem';
import UpdateUser from './pages/UpdateUser';
import VerifyUserUpdate from './pages/VerifyUserUpdate';
import SuccessfulPayment from './pages/SuccessfulPayment';
import CancelPayment from './pages/CancelPayment';
import ReqItemReturn from './pages/ReqItemReturn';
import ReqItemReceipt from './pages/ReqItemReceipt';
import DeleteItem from './pages/DeleteItem';
import ReqDeleteUser from './pages/ReqDeleteUser';
import VerifyDeleteUser from './pages/VerifyDeleteUser';
import Listings from './pages/Listings';
import Profile from './pages/Profile';
import RentedItems from './pages/RentedItems';
import Logout from './pages/Logout';
import TermsAndCondition from './pages/TermsAndConditions';

let isLoggedIn = false;

if (document.cookie.includes("access_token")) {
  isLoggedIn = true;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="items" element={<Items />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verifyotp" element={<VerifyOTP />} />
          <Route path="termsandcondition" element={<TermsAndCondition />} />
          <Route path="items/:id" element={<ItemByID />} />

          {isLoggedIn ? (
            <>
            <Route path="newitem" element={<NewItem />} />
            <Route path="updateitem/:id" element={<UpdateItem />} />
            <Route path="updateuser" element={<UpdateUser />} />
            <Route path="verifyuserupdate" element={<VerifyUserUpdate/>} />
            <Route path="successful/:id" element={<SuccessfulPayment/>} />
            <Route path="cancel/:id" element={<CancelPayment />} />
            <Route path="return/:id" element={<ReqItemReturn />} />
            <Route path="receipt/:id" element={<ReqItemReceipt />} />
            <Route path="deleteitem/:id" element={<DeleteItem />} />
            <Route path="reqdeleteuser" element={<ReqDeleteUser />} />
            <Route path="verifydeleteuser" element={<VerifyDeleteUser />} />
            <Route path="listings" element={<Listings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="renteditems" element={<RentedItems />} />
            <Route path="logout" element={<Logout />} />
            </>
          ): null}

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);