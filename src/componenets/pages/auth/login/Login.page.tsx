import { useState } from "react";
import { UseModal } from "../../../../interface/header";
import { secure } from "../../../../utils/secure";
import { LoginContainer, LoginInput } from "./style";



//모달 변경되게
export const Login = (props: any) => {
    const onSignup = props.onSignup;
    const secureWrap = secure().wrapper()
    
    const OAuthButtonBlock = () => {
        return (
            <div>
                <button>구글</button>
                <button>카카오</button>
            </div>
        )
    };

    const sendLoginData = (sendData:any) => {
        //서버전송. 암호문 날아감
        //const form = { email: '', password: '' }
        //const temp = secure().local().getItem('user')!
        //const encryptedSendData = secure().wrapper().encryptWrapper(sendData)
        console.log('서버에서 받는 것',sendData)
        console.log('서버에서 해석 email',secureWrap.decryptWrapper(sendData.email))
        console.log('서버에서 해석 password',secureWrap.decryptWrapper(sendData.password))
    }
    

    return (
        <LoginContainer>
            <div>로고</div>
            <LoginBlock useModal={props.useModal} sendLoginData={sendLoginData}/>
            <div onClick={onSignup}>회원가입은 여기 클릭</div>
            <OAuthButtonBlock />
        </LoginContainer>
    )
}

export const LoginBlock = (props:any) => {
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
