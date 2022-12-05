import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import config from "../../../../config";
import { UseModal } from "../../../../interface/header";
import { secure } from "../../../../utils/secure";
import { SignupContainer, SignupInput } from "./style";





//모달 변경되게
export const Signup = (props: any) => {
    const useModal: UseModal = props.useModal;
    const secureWrap = secure().wrapper()
    const [signupInput, setSignupInput] = useState({ email: '', password: '', passwordCheck: '' })

    const onsignupInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setSignupInput({ ...signupInput, [key]: secureWrap.encryptWrapper(e.target.value) });
    };

    const onClose = () => {
        useModal.closeModal()
    }

    const sendSignupData = async (signupData:any) => {
        try {
            const userSignup = await axios.post(
                `${config.SERVER_HOST}/api/user`,
                signupData,
                { withCredentials: true }
              );
              console.log(userSignup)
          } catch (error) {
            console.log(error)
          }
        //서버전송. 암호문 날아감
        // const temp = secure().local().setItem('user', JSON.stringify(signupData))
        // return 'save'
    }
    const signupDataForm = (signupInput:{
        email: string;
        password: string;
        passwordCheck: string;
    }) => {
        Reflect.deleteProperty(signupInput,'passwordCheck')
        return signupInput
    }
    const onSignup = () => {
        sendSignupData(signupDataForm(signupInput))
        useModal.closeModal()

    }
    const SignUpButtonBlock = () => {
        return (
            <div>
                <button onClick={onClose}>취소</button>
                <button onClick={onSignup}>가입</button>
            </div>
        )
    }
    const passwordValid = ()=> {
        //비번과 비번확인 비교
    }
    return (
        <SignupContainer>
            <SignupInput>
                <div>이메일</div>
                <input type="email" onChange={onsignupInput('email')} required />
            </SignupInput>
            <SignupInput>
                <div>비밀번호</div>
                <input type="password" onChange={onsignupInput('password')} required />
            </SignupInput>
            <SignupInput>
                <div>비밀번호확인</div>
                <input type="password" onChange={onsignupInput('passwordCheck')} required />
            </SignupInput>
            <SignUpButtonBlock />
        </SignupContainer>
    )
};

