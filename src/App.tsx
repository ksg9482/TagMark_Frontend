import React from 'react';
import AppRouter from "./routers/router";
import './App.css';
import Header from './componenets/blocks/header/Header';
import styled from 'styled-components';
const getJwtToken = () => {
  if (localStorage.getItem('accessToken') === 'undefined') {
    return false;
  }
  return localStorage.getItem('accessToken')!;
};
const isLoggedIn = getJwtToken() ? true : false;

function App() {
  return (
    <div className="App">
      <Header isLogin={isLoggedIn}/>
      <MainContainer >
        <div></div>
        {AppRouter(isLoggedIn)}
        <div></div>
      </MainContainer>
    </div>
  )
}
const MainContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 60% 20%;
  padding: 40px 0 40px 0;

`;

export default App;
