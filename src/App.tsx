import React, { useState } from 'react';
import AppRouter from "./routers/router";
import './App.css';
import Header from './componenets/blocks/header/Header';
import styled from 'styled-components';
import { secure } from './utils/secure';
import { BrowserRouter as Router } from 'react-router-dom';
const getJwtToken = () => {
  if (localStorage.getItem('accessToken') === 'undefined') {
    return false;
  }
  return localStorage.getItem('accessToken') ? true : false;
};

const isLoggedIn = getJwtToken();

function App() {
  const [logined, setLogined] = useState(false);

  return (
    <AppContainer className="App">
      <Router>
        <Header isLogin={isLoggedIn} />
      <MainContainer >
        <div></div>
        {AppRouter(isLoggedIn)}
        <div></div>
      </MainContainer>
      </Router>
    </AppContainer>
  )
}
const AppContainer = styled.div`
  height: 100vh;
`
const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 60% 20%;
  @media (max-width: 1000px) {
    grid-template-columns: 10% 80% 10%;
  }
  @media (max-width: 600px) {
    grid-template-columns: 0 100% 0;
  }
  background-color: gray;
  min-height: 100%;
`;

export default App;
