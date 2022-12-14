import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import config from "../../../../config";
import { UseModal } from "../../../../interface/header";
import { secure } from "../../../../utils/secure";
import { SignUpButtonBlock } from "../../../blocks/auth/signup/SignupButton.block";
import { CommonInput, ModalTitle, SignupContainer, SignupInput } from "./style";





//모달 변경되게
export const Signup = (props: any) => {
    const useModal: UseModal = props.useModal;
    const secureWrap = secure().wrapper()
    const [signupInput, setSignupInput] = useState({ email: '', password: '', passwordCheck: '' })

    const onsignupInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 0) {
            setSignupInput({ ...signupInput, [key]: '' });
            return ;
        }
        setSignupInput({ ...signupInput, [key]: secureWrap.encryptWrapper(e.target.value) });
    };

    const onClose = () => {
        useModal.closeModal()
    }
    const securedSendData = (data:any) => {
       return secureWrap.encryptWrapper(JSON.stringify(data))
    }
    const sendSignupData = async (signupData:any) => {
        try {
            const userSignup = await axios.post(
                `${config.SERVER_HOST}/api/user`,
                signupData,
                { withCredentials: true }
              );
              //console.log(userSignup)
          } catch (error) {
            console.log(error)
          }
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
        const securedData:string = securedSendData(signupDataForm(signupInput))
        sendSignupData(securedData)
        useModal.closeModal()

    }
    
    const passwordValid = ()=> {
        //비번과 비번확인 비교
    }
    return (
        <SignupContainer>
            <ModalTitle>회원가입</ModalTitle>
            <CommonInput>
                <div>이메일</div>
                <input type="email" onChange={onsignupInput('email')} required />
            </CommonInput>
            <CommonInput>
                <div>비밀번호</div>
                <input type="password" onChange={onsignupInput('password')} required />
            </CommonInput>
            <CommonInput>
                <div>비밀번호확인</div>
                <input type="password" onChange={onsignupInput('passwordCheck')} required />
            </CommonInput>
            <SignUpButtonBlock onClose={onClose} onSignup={onSignup}/>
        </SignupContainer>
    )
};

