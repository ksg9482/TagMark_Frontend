import { useState } from "react";
import { UseModal } from "../../../../interface/header";
import { secure } from "../../../../utils/secure";
import { LoginContainer, LoginInput } from "../../../pages/auth/login/style";

export const LoginBlock = (props: any) => {
    const useModal: UseModal = props.useModal;
    const secureWrap = secure().wrapper()
    const sendLoginData = props.sendLoginData
    const [loginInput, setLoginInput] = useState({ email: '', password: '' })

    const onLoginInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setLoginInput({ ...loginInput, [key]: secureWrap.encryptWrapper(e.target.value) });
    };

    const onClose = () => {
        useModal.closeModal()
    }

    const onLogin = () => {
        sendLoginData(loginInput)
        useModal.closeModal()
        // eslint-disable-next-line no-restricted-globals
        location.reload()
    }
    return (
        <LoginContainer>
            <LoginInput >
                <div>이메일</div>
                <input type="text" onChange={onLoginInput('email')} />
            </LoginInput>
            <LoginInput>
                <div>비밀번호</div>
                <input type="text" onChange={onLoginInput('password')} />
            </LoginInput>
            <button onClick={onLogin}>로그인</button>
            <button onClick={onClose}>취소</button>
        </LoginContainer>
    )
}