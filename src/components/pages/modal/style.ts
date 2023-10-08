import styled from "styled-components";

export const ModalBaseContainer = styled.div`
  position: absolute;
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #81818194;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh + 40px);
  z-index: 2;
`;

export const AlramModalContainer = styled.div`
  position: fixed;
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #81818194;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  z-index: 2;
`;

export const ModalContentContainer = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #ffffff;
  width: 400px;
  height: 550px;
  z-index: 1;
  border: 1px solid;
  padding: 0 5px 0 5px;
  border-radius: 3px;
`;

export const AlramModalContentContainer = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #ffffff;
  width: 300px;
  height: 150px;
  z-index: 1;
  border: 1px solid;
  padding: 0 5px 0 5px;
  border-radius: 3px;
  gap: 10px;
`;

export const ModalTitle = styled.div`
  margin-bottom: 15px;
  font-size: large;
`;

export const ModalTitleLong = styled.div`
  margin-bottom: 15px;
  font-size: large;
  margin-bottom: 40px;
`;

export const ModalContentTop = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid;
  border-color: #c5c5c5;
  padding: 8px 10px 8px 10px;
  margin: 0 0 80px 0;

  height: fit-content;
  #title {
    justify-self: left;

    height: fit-content;
  }
  #exit {
    justify-self: end;
  }
`;
