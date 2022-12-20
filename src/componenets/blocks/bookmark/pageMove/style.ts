import styled from "styled-components";

export const PageNumsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
`;


export const PageButtonsContainer = styled.div`
display: grid;
align-content:flex-end;
padding-bottom: 5px;
border-bottom: 1px solid #bbb;
`;

export const PageButtonsContent = styled.div`
    display: grid;
    grid-template-columns: 15% 15% 40% 15% 15%;
    margin-top: 5px;
    align-content:flex-end;
    //border-radius: 5px;
`;
