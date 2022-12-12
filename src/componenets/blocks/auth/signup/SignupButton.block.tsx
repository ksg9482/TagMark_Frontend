export const SignUpButtonBlock = (props:any) => {
    const onClose = props.onClose
    const onSignup = props.onSignup
    return (
        <div>
            <button onClick={onClose}>취소</button>
            <button onClick={onSignup}>가입</button>
        </div>
    )
}