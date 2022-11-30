import styled from "styled-components";
import { UseModal } from "../../../../interface/header";
import { LoginContainer, LoginInput } from "./style";



//모달 변경되게
export const Login = (props:any) => {
    const useModal:UseModal = props.useModal;
    const onSignup = props.onSignup;
const EmailInput = () => {
    return (
        <LoginInput>
            <div>이메일</div>
            <input type="email" required />
        </LoginInput>
    )
};

const PasswordInput = () => {
    return (
        <LoginInput>
            <div>비밀번호</div>
            <input type="password" required />
        </LoginInput>
    )
};


const onClose = ()=>{
    useModal.closeModal()
    //useModal.closeModal()
}
const OAuthButtonBlock = () => {
    return (
        <div>
            <button>구글</button>
            <button>카카오</button>
        </div>
    )
}
    return (
        <LoginContainer>
            <div>로고</div>
            <LoginContainer>
                <EmailInput />
                <PasswordInput />
                <button>로그인</button>
                <button onClick={onClose}>취소</button>

            </LoginContainer>
            <div onClick={onSignup}>회원가입은 여기 클릭</div>
            <OAuthButtonBlock />
        </LoginContainer>
    )
}
