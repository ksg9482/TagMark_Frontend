import styled from "styled-components";

export const SignupInput = styled.div`
  display: grid;
  grid-template-columns: 100px auto;
`;

export const ModalTitle = styled.div`
  margin-bottom: 55px;
  font-size: large;
`;

export const ModalText = styled.div``;

export const SignupContainer = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  height: 550px;
  width: 400px;
`;

export const CommonInput = styled.div`
  display: grid;
  grid-template-columns: 100px auto;
  gap: 5px;
  #input-name {
    justify-self: flex-start;
  }
`;

export const CommonButtonContainer = styled.div`
  display: grid;
  gap: 5px;
  margin-top: 15px;
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
