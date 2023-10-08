import styled from "styled-components";

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
