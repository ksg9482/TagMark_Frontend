import { useState } from "react";
import { UseModal } from "../../../../interface/header";
import { secure } from "../../../../utils/secure";
import { CommonButtonContainer, CommonInput, LoginContainer } from "./styles";

export const LoginBlock = (props: any) => {
    const useModal: UseModal = props.useModal;
    const errorMessage = props.errorMessage;
    const updateErrorMessage = props.updateErrorMessage;
    const secureWrap = secure().wrapper()
    const sendLoginData = props.sendLoginData
    const [loginInput, setLoginInput] = useState({ email: '', password: '' })

    const onLoginInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 0) {
            setLoginInput({ ...loginInput, [key]: '' });
            return ;
        }
        setLoginInput({ ...loginInput, [key]: secureWrap.encryptWrapper(e.target.value) });
    };

    const onClose = () => {
        useModal.closeModal()
    }

    const inputCheck = (loginInput:any) => {
        const {email, password} = loginInput;
        
        if(email.length <= 0) {
            updateErrorMessage('이메일을 입력해주세요')
            return false;
        }
        if(password.length <= 0) {
            updateErrorMessage('비밀번호를 입력해주세요')
            return false;
        }
        return true;
    };
    const onLogin = () => {
        if(!inputCheck(loginInput)){
            return ;
        }
        sendLoginData(loginInput)
        useModal.closeModal()
        // eslint-disable-next-line no-restricted-globals
        location.reload()
    }
    console.log(loginInput)
    return (
        <LoginContainer>
            <CommonInput >
                <div>이메일</div>
                <input type="email" onChange={onLoginInput('email')} />
            </CommonInput>
            <CommonInput>
                <div>비밀번호</div>
                <input type="password" onChange={onLoginInput('password')} />
            </CommonInput>
            {errorMessage ? <div>{errorMessage}</div> : <div>&nbsp;</div>}
            <CommonButtonContainer>
            <button onClick={onLogin}>로그인</button>
            <button onClick={onClose}>취소</button>
            </CommonButtonContainer>
        </LoginContainer>
    )
}

