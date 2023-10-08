import styled from "styled-components";

export const SignupContainer = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  height: 550px;
  width: 400px;
`;

export const ErrorMessageBlock = styled.div`
  margin-top: 10px;
  color: red;
  font-size: small;
`;

export const SignUpBlock = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
  align-self: flex-start;
`;

export const ContentBody = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  justify-items: center;
  justify-self: center;
  align-items: center;
  width: 400px;
  #move-signup {
    align-self: flex-start;
    margin-bottom: 20px;
  }
`;

export const CommonButton = styled.button`
  white-space: nowrap;
  min-width: fit-content;

  height: fit-content;
`;
