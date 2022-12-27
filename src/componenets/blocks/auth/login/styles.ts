import styled from "styled-components";

export const ModalTitle = styled.div`
    margin-bottom: 15px;
    font-size: large;
`;
export const ModalText = styled.div`

`;
export const LoginContainer = styled.div`
    display: grid;
    gap: 10px;
    margin-bottom: 30px;
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
    justify-items: center;
    gap: 5px;
    margin-top: 15px;
    grid-template-columns: 1fr 1fr;
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