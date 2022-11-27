import styled from "styled-components";
import { UseModal } from "../../../blocks/header/header";



const SignupInput = styled.div`
    display: grid;
    grid-template-columns: 100px auto;
`;
const SignupContainer = styled.div`
    display: grid;
    gap: 5px;
    justify-content: center;
`;

//모달 변경되게
export const Signup = (props:any) => {
    const useModal:UseModal = props.useModal;

    const EmailInput = () => {
        return (
            <SignupInput>
                <div>이메일</div>
                <input type="email" required />
            </SignupInput>
        )
    };
    
    const PasswordInput = () => {
        return (
            <SignupInput>
                <div>비밀번호</div>
                <input type="password" required />
            </SignupInput>
        )
    };
    
    const PasswordCheckInput = () => {
        return (
            <SignupInput>
                <div>비밀번호확인</div>
                <input type="password" required />
            </SignupInput>
        )
    };
    const onClose = ()=>{
        useModal.closeModal()
        //useModal.closeModal()
    }
    const SignUpButtonBlock = () => {
        return (
            <div>
                <button onClick={onClose}>취소</button>
                <button>가입</button>
            </div>
        )
    }

    return (
        <SignupContainer>
            <EmailInput />
            <PasswordInput />
            <PasswordCheckInput />
            <SignUpButtonBlock />
        </SignupContainer>
    )
}
