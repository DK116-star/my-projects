import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from  'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Newproduct from './pages/Newproduct';
import Signup from './pages/Signup';
import { store } from './redux/index';
import { Provider } from "react-redux";
import Cart from './pages/Cart';
import WishlistPage from './pages/wishList';
import Orders from './pages/myOrders';
import AdminPage from './AdminPage';
import OrderDetails from './AllOrders';
import SaveItForLater from './pages/saveItForLater';

// this file deals with the routes 
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path = "admin-home" element = {<AdminPage/>}/>
    <Route path ='newproduct' element = {<Newproduct/>}/>
    <Route path = "all-orders" element = {<OrderDetails/>}/>
    <Route path = '/' element = {<App/>}>
      <Route index element = {<Home/>}/>
      {/**<Route path ='menu' element = {<Menu/>}/>*/}
      <Route path ='menu/:filterby' element = {<Menu/>}/>
      <Route path ='about' element = {<About/>}/>
      <Route path ='contact' element = {<Contact/>}/>
      <Route path ='login' element = {<Login/>}/>
      <Route path ='signup' element = {<Signup/>}/>
      <Route path ='cart' element = {<Cart/>}/>
      <Route path = "wish-list" element = {<WishlistPage/>}/>
      <Route path = "my-orders" element = {<Orders/>}/>
      <Route path = "save-it-for-later" element = {<SaveItForLater/>}/>
    </Route>
    </>
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store ={store}>
  <RouterProvider router = {router}/>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

