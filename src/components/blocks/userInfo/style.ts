import styled from "styled-components";

export const UserDeleteContainer = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  height: 550px;
  width: 400px;
`;

export const UserEditContainer = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  height: 550px;
  width: 400px;
`;

export const ContentBody = styled.div`
  display: grid;
  grid-template-rows: min-content min-content min-content min-content;
  justify-items: center;
  justify-self: center;
  align-items: center;
  width: 300px;
`;

export const TextContainer = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
`;

export const ErrorMessageBlock = styled.div`
  margin-top: 10px;
  color: red;
  font-size: small;
`;
