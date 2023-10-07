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
  gap: 5px;
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

export const ContentBody = styled.div`
  display: grid;
  grid-template-rows: min-content min-content min-content auto;
  justify-items: center;
  justify-self: center;
  align-items: center;
  width: 400px;

  #social-login {
    align-self: flex-start;
  }
`;

export const LoginContent = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  height: 550px;
  width: 400px;
`;

export const CommonButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  white-space: nowrap;
  min-width: fit-content;
  background-color: #f9f9f9;
  &:hover {
    background-color: #e7e7e7;
  }

  margin: 0;
  padding: 0.2rem 0.5rem;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  width: auto;
  border: none;
  border-radius: 4px;
  box-shadow: 3px 4px 2px -1px rgba(0, 0, 0, 0.1),
    3px 4px 2px -1px rgba(0, 0, 0, 0.06);

  transition: 0.2s;
  background-color: rgba(0, 0, 0, 0.03);
`;
