import styled from "styled-components";

export const LoginInput = styled.div`
    display: grid;
    grid-template-columns: 100px auto;
`;



export const ModalTitle = styled.div`
    margin-bottom: 55px;
    font-size: large;
`;

export const MoveSignupPage = styled.div`
    color: blue;
    font-size: small;
    text-decoration-line: underline;
    margin-bottom: 40px;
`;

export const LoginContainer = styled.div`
    display: grid;
    gap: 10px;
`;

export const CommonInput = styled.div`
    display: grid;
    grid-template-columns: 100px auto;
    gap:5px;
`;

export const CommonButtonContainer = styled.div`
    display: grid;
    gap: 5px;
    margin-top: 15px;
`;

export const ContentTop = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid;
  border-color: #c5c5c5;
  padding: 8px 10px 8px 10px;
  margin: 0 0 100px 0;
  
  height: fit-content;
  #title {
    justify-self: left;
    
    height: fit-content;
  }
  #exit {
    justify-self: end;
  }
`;

export const ContentBody = styled.div`
  display: grid;
  grid-template-rows: min-content min-content min-content auto;
  justify-items: center;
  justify-self: center;
  //align-self: center;
  align-items: center;
  //align-content: center;
  width: 400px;
  
  #social-login{
    align-self: flex-start;
  }
`;

export const LoginContent = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  height: 700px;
  width: 500px;
`;

export const CommonButton = styled.button`
    white-space: nowrap;
    min-width: fit-content;
    
    height: fit-content;
`;
