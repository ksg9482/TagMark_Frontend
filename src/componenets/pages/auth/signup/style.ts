import styled from "styled-components";

export const SignupInput = styled.div`
    display: grid;
    grid-template-columns: 100px auto;
`;

export const ModalTitle = styled.div`
    margin-bottom: 55px;
    font-size: large;
`;
export const ModalText = styled.div`

`;
export const SignupContainer = styled.div`
   display: grid;
  grid-template-rows: min-content auto;
  height: 700px;
  width: 500px;
`;
export const CommonInput = styled.div`
    display: grid;
    grid-template-columns: 100px auto;
    gap:5px;
    #input-name {
        justify-self: flex-start;
    }
`;
export const CommonButtonContainer = styled.div`
    display: grid;
    gap: 5px;
    margin-top: 15px;
`;