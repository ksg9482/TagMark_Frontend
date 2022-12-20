import styled from "styled-components";

export const HeaderContainer = styled.div`
display: grid;
grid-template-columns: 20% 60% 20%;
height: 30px;
//align-items: center;
button{
    width: fit-content;
    height: fit-content;
}
@media (max-width: 1000px) {
    grid-template-columns: 10% 80% 10%;
}
@media (max-width: 640px) {
    grid-template-columns: 0 100% 0;
}
    position: fixed;
    width: 100%;
    box-shadow: 0 1px 1px 1px #e3e3e3;
    background-color: white;
    padding-top: 5px;
    padding-bottom: 5px;
`;

export const CommonButton = styled.button`
    white-space: nowrap;
    min-width: fit-content;
    width: 85px;
`;