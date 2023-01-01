import styled from "styled-components";

export const ModalTitle = styled.div`
    margin-bottom: 15px;
    font-size: large;
    margin-bottom: 40px;
`;
export const ModalText = styled.div`

`;
export const UserDeleteContainer = styled.div`
    display: grid;
  grid-template-rows: min-content auto;
  height: 700px;
  width: 500px;
`;
export const CommonInput = styled.div`
    display: grid;
    grid-template-columns: 100px auto;
    gap:5px;
    text-align: left;
`;
export const CommonButtonContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 30px;
    margin-top: 40px;
    button {
        min-width: 100px;
    }
`;

export const UserEditContainer = styled.div`
    display: grid;
  grid-template-rows: min-content auto;
  height: 700px;
  width: 500px;
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

export const CommonButton = styled.button`
    white-space: nowrap;
    min-width: fit-content;
    
    height: fit-content;
`;

export const ContentBody = styled.div`
  display: grid;
  grid-template-rows: min-content min-content min-content min-content;
  justify-items: center;
  justify-self: center;
  align-items: center;
  width: 300px;
  
`;

export const InputContainer = styled.div`
    display: grid;
    gap: 10px;
    margin-bottom: 20px;
`;

export const TextContainer = styled.div`
    display: grid;
    gap: 10px;
    margin-bottom: 20px;
`;