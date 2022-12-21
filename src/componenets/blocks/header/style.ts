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
    padding: 5px 0 5px 0;
`;

export const ContentChangeButton = styled.button`
    display: grid;
    gap: 2px;
    grid-template-columns: auto auto;
    align-items: center;
    justify-items: center;
    white-space: nowrap;
    box-sizing: border-box;
    min-width: 80px;
    min-height: 30px;
    background-color: #ffffff;
    &:hover {
        background-color: #deebff;
    }
    border: 3px solid #97b5e1;
    border-radius: 15px;
    font-size: medium;
    transition: 0.2s;
`;

export const ButtonContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto;
`;

export const HeaderButtonContainer = styled.div`
    display:grid;
    justify-items: end;
    align-items: center;
`;

export const HeaderContent = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: 20% auto 40%;
    padding: 0 10px 0 0;
`;

export const LogoutButton = styled.button`
    white-space: nowrap;
    box-sizing: border-box;
    width: 100px;
    min-height: 30px;
    background-color: #ffffff;
    border: 3px solid #97b5e1;
    &:hover {
        border: 3px solid #ff8d8d;
    }
    border-radius: 15px;
    font-size: medium;
`;