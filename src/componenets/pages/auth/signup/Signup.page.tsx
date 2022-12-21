import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import config from "../../../../config";
import { UseModal } from "../../../../interface/header";
import { secure } from "../../../../utils/secure";
import { SignUpButtonBlock } from "../../../blocks/auth/signup/SignupButton.block";
import { CommonButton, CommonInput, ContentBody, ContentTop, ErrorMessageBlock, ModalTitle, SignUpBlock, SignupContainer, SignupInput } from "./style";





//모달 변경되게
export const Signup = (props: any) => {
    const useModal: UseModal = props.useModal;
    const secureWrap = secure().wrapper()
    const [signupInput, setSignupInput] = useState({ email: '', password: '', passwordCheck: '' })
    const [errorMessage, setErrorMessage] = useState('')

    const onsignupInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 0) {
            setSignupInput({ ...signupInput, [key]: '' });
            return;
        }
        setSignupInput({ ...signupInput, [key]: secureWrap.encryptWrapper(e.target.value) });
    };

    const onClose = () => {
        useModal.closeModal()
    }
    const securedSendData = (data: any) => {
        return secureWrap.encryptWrapper(JSON.stringify(data))
    }
    const sendSignupData = async (signupData: any) => {
        try {
            const userSignup = await axios.post(
                `${config.SERVER_HOST}/api/user`,
                signupData,
                { withCredentials: true }
            );
            return userSignup
        } catch (error) {
            console.log(error)
        }
    }
    const signupDataForm = (signupInput: {
        email: string;
        password: string;
        passwordCheck: string;
    }) => {
        Reflect.deleteProperty(signupInput, 'passwordCheck')
        console.log(signupInput)
        return signupInput;
    };

    
    const inputCheck = (signupInput:any) => {
        const {email, password, passwordCheck} = signupInput;
        
        if(email.length <= 0) {
            setErrorMessage('이메일을 입력해주세요')
            return false;
        }
        if(password.length <= 0) {
            setErrorMessage('비밀번호를 입력해주세요')
            return false;
        }
        if(passwordCheck.length <= 0) {
            setErrorMessage('비밀번호확인을 입력해주세요')
            return false;
        }
        
        if(secureWrap.decryptWrapper(password) !== secureWrap.decryptWrapper(passwordCheck)) {
            setErrorMessage('비밀번호와 비밀번호 확인이 다릅니다.')
            return false;
        }
        return true;
    };
    
    const onSignup = async () => {
        if(!inputCheck(signupInput)){
            return ;
        }
        //const securedData: string = securedSendData(signupDataForm(signupInput))
        const signupResp = await sendSignupData(signupDataForm(signupInput))
        if(signupResp?.data.error){
            setErrorMessage(signupResp?.data.error)
            return ;
        }
        useModal.closeModal()
    }

    
    return (
        <SignupContainer>
            <ContentTop>
                <div id="title">Login</div>
                <CommonButton id="exit" onClick={onClose}>X</CommonButton>
            </ContentTop>
            <ContentBody>
                <ModalTitle>TAG MARK 회원가입</ModalTitle>
                <SignUpBlock>
                    <CommonInput>
                        <div id="input-name">이메일</div>
                        <input type="email" onChange={onsignupInput('email')} required />
                    </CommonInput>
                    <CommonInput>
                        <div id="input-name">비밀번호</div>
                        <input type="password" onChange={onsignupInput('password')} required />
                    </CommonInput>
                    <CommonInput>
                        <div id="input-name">비밀번호확인</div>
                        <input type="password" onChange={onsignupInput('passwordCheck')} required />
                    </CommonInput>
                    {errorMessage ? <ErrorMessageBlock>{errorMessage}</ErrorMessageBlock> : <ErrorMessageBlock>&nbsp;</ErrorMessageBlock>}
                    <SignUpButtonBlock onClose={onClose} onSignup={onSignup} />
                </SignUpBlock>
            </ContentBody>
        </SignupContainer>
    )
};

