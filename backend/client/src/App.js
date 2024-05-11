
import './App.css';
import Header from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import Home from './components/Home';
import ProductDetail from './components/product/productdetail';
import {BrowserRouter as Router,Routes,Route}  from 'react-router-dom'
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/user/profile';
import UpdateProfile from './components/user/UpdateProfile';
import ProtectedRoutes from './components/auth/ProtectedRoutes';
import UploadAvatar from './components/user/UploadAvatar';
import UpdatePassword from './components/user/UpdatePassword';
import Cart from './components/cart/cart';


function App() {
  return (
    <Router>
    <div className="App">
<Header/>
<div className='container'>
  <Routes>
    <Route path ="/"element ={<Home/>}></Route>
    <Route path ="/product/:id"element ={<ProductDetail/>}></Route>
    <Route path ="/login"element ={<Login/>}></Route>
    <Route path ="/register"element ={<Register/>}></Route>
    <Route path ="/me/profile"element ={
    <ProtectedRoutes>
    <Profile/>
    </ProtectedRoutes>}></Route>
    <Route path="/me/update_profile" element={<ProtectedRoutes><UpdateProfile /></ProtectedRoutes>} />
 
    <Route path="/me/upload_avatar" element={ <ProtectedRoutes><UploadAvatar /></ProtectedRoutes>} />

    <Route path="/me/update_password" element={ <ProtectedRoutes><UpdatePassword/></ProtectedRoutes>} />

    <Route path ="/cart"element ={<Cart/>}></Route>

  </Routes>

</div>

<Footer/>
    </div>
    </Router>
  );
}

export default App;
