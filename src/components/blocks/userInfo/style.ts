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

export const TagAreaContainer = styled.div`
  display: grid;
  align-items: center;
  height: 100%;
  padding: 0 5px 0 5px;
  grid-template-rows: 15% auto;
`;

export const GraphContainer = styled.div`
  .div {
    position: unset;
  }
  height: 400px;
  max-height: 50vh;
`;

export const MyDataContainer = styled.div`
  display: grid;
  align-items: center;
  height: 100%;
  padding: 0 5px 0 5px;
  grid-template-rows: 15% min-content auto;
`;

export const MyInfoContainer = styled.div`
  display: grid;
  align-self: flex-start;
  margin-bottom: 20px;
  .email-info {
    display: grid;
  }
`;

export const MyDataButtonContainer = styled.div`
  display: grid;
  gap: 30px;
  justify-items: center;
  height: 100%;
  button {
    width: 50%;
    height: fit-content;
  }
  .edit-button {
    display: grid;
    align-self: flex-start;
  }
  .delete-button {
    display: grid;
    align-self: flex-start;
  }
`;
