import styled from "styled-components";

export const SignUpButtonBlock = (props:any) => {
    const onClose = props.onClose
    const onSignup = props.onSignup
    return (
        <CommonButtonContainer>
            <button onClick={onSignup}>가입</button>
            <button onClick={onClose}>취소</button>
        </CommonButtonContainer>
    )
}
export const CommonButtonContainer = styled.div`
    display: grid;
    justify-items: center;
    gap: 5px;
    margin-top: 10px;
    grid-template-columns: 1fr 1fr;
`;