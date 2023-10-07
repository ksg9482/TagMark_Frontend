import styled from "styled-components";

export const ModalTitle = styled.div`
  margin-bottom: 15px;
  font-size: large;
`;
export const ModalText = styled.div``;
export const LoginContainer = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 30px;
`;
export const CommonInput = styled.div`
  display: grid;
  grid-template-columns: 100px auto;
  gap: 5px;
  #input-name {
    justify-self: flex-start;
  }
`;

export const OauthButtonContainer = styled.div`
  display: grid;
  justify-items: center;
  gap: 5px;
  margin-top: 10px;
  gap: 15px;
  width: 100%;
`;

export const ErrorMessageBlock = styled.div`
  margin-top: 10px;
  color: red;
  font-size: small;
`;

export const OAuthButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-items: center;
  max-height: fit-content;
  gap: 5px;

  margin: 0;
  padding: 0.2rem 0.5rem;
  font-family: "Noto Sans KR", sans-serif;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  text-decoration: none;
  width: auto;
  min-width: 240px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  transition: 0.2s;
  background-color: #ffffff;
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const Img = styled.img`
  height: 30px;
  width: auto;
`;
