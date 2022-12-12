import styled from "styled-components";

export const ModalContainer = styled.div`
  position: absolute;
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #81818194;
  width: 100vw;
  height: 100vh;
  z-index: 2;
`;

export const UserInfoModalContainer = styled.div`
  position: absolute;
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #81818194;
  top:0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
`;


export const ModalContentContainer = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #ffffff;
  width: 600px;
  height: 800px;
  z-index: 1;
`;