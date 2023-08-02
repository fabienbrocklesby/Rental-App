import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="items" element={<Items />} />
          <Route path="items/:id" element={<ItemByID />} />
          <Route path="newitem" element={<NewItem />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verifyotp" element={<VerifyOTP />} />
          <Route path="updateitem" element={<UpdateItem />} />
          <Route path="updateuser" element={<UpdateUser />} />
          <Route path="verifyuserupdate" element={< VerifyUserUpdate/>} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);