import styled from "styled-components";

export const SideBarInput = styled.input`
    width: 95%;
    margin-top: 15px;
`;

export const SideBarContainer = styled.div`
    display: grid;
    grid-template-rows: min-content min-content auto;
    height: fit-content;
    padding: 0 5px 5px 5px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px 2px #bbbbbb;
    width: 100%;
    justify-items: center;
`;

export const CommonButton = styled.button`
    white-space: nowrap;
    min-width: fit-content;
    height: fit-content;
`;