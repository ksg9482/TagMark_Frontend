import React from 'react';
import AppRouter from "./routers/router";
import './App.css';
import Header from './componenets/blocks/header/header';
import SideBar from './componenets/blocks/sidebar/sidebar';
const getJwtToken = () => {
  if(localStorage.getItem('accessToken') === 'undefined') {
    return false;
  }
  return localStorage.getItem('accessToken')!;
};
const isLoggedIn = getJwtToken() ? true : false; 
function App() {
  return <div className="App">
    <div><Header /></div>
    <div><SideBar /></div>
    {AppRouter(isLoggedIn)}
    </div>;
}

export default App;
