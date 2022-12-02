import React, { useState } from 'react';
import AppRouter from "./routers/router";
import './App.css';
import Header from './componenets/blocks/header/Header';
import styled from 'styled-components';
import { secure } from './utils/secure';
import { BrowserRouter as Router } from 'react-router-dom';
const getJwtToken = () => {
  //임시용
  if (localStorage.getItem('user')) {
    return true
  }
  if (localStorage.getItem('accessToken') === 'undefined') {
    return false;
  }
  return localStorage.getItem('accessToken')!;
};

const isLoggedIn = getJwtToken() ? true : false;

function App() {
  const [logined, setLogined] = useState(false);

  return (
    <div className="App">
      <Router>
        <Header isLogin={isLoggedIn} />
      <MainContainer >
        <div></div>
        {AppRouter(isLoggedIn)}
        <div></div>
      </MainContainer>
      </Router>
    </div>
  )
}
const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 60% 20%;
  padding: 40px 0 40px 0;

`;

export default App;
