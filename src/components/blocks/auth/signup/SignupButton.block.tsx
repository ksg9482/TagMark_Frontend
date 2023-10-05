import { CommonButtonContainer } from "./styles"

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