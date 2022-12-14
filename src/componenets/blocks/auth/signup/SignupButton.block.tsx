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
    gap: 10px;
    margin-top: 15px;
`;