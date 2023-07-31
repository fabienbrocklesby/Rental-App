import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PageNotFound from './pages/PageNotFound';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Items from './pages/Items';
import NewItem from './pages/NewItem';
import Register from './pages/Register';
import Login from './pages/Login';
import ItemByID from './pages/ItemByID';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="items" element={<Items />} />
          <Route path="items/:id" element={<ItemByID />} />
          {/* <Route path="newitem" element={<NewItem />} /> */}
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);