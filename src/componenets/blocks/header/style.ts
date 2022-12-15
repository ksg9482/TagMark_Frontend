import styled from "styled-components";

export const HeaderContainer = styled.div`
display: grid;
grid-template-columns: 20% 60% 20%;
@media (max-width: 1000px) {
    grid-template-columns: 10% 80% 10%;
}
@media (max-width: 600px) {
    grid-template-columns: 0 100% 0;
}
    position: fixed;
    width: 100%;
    border: 1px solid;
    background-color: white;
    padding-top: 5px;
    padding-bottom: 5px;
`;

export const CommonButton = styled.button`
    white-space: nowrap;
    min-width: fit-content;
    width: 85px;
`;