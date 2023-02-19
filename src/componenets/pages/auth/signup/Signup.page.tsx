import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import config from "../../../../config";
import { Singupform } from "../../../../interface/auth";
import { UseModal } from "../../../../interface/header";
import { secure } from "../../../../utils/secure";
import { SignUpButtonBlock } from "../../../blocks/auth/signup/SignupButton.block";
import { CommonButton, CommonInput, ContentBody, ContentTop, ErrorMessageBlock, ModalTitle, SignUpBlock, SignupContainer } from "./style";

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
    
    const sendSignupData = async (signupData: any) => {
            const userSignup = await axios.post(
                `${config.SERVER_HOST}/api/user`,
                signupData,
                { withCredentials: true }
            );
            return userSignup;
    }
    const signupDataForm = (signupInput: Singupform) => {
        Reflect.deleteProperty(signupInput, 'passwordCheck')
        let signupData:Singupform ={email:'', password:''};
        signupData.email = secureWrap.decryptWrapper(signupInput.email)
        signupData.password = secureWrap.decryptWrapper(signupInput.password)
        return signupData;
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
        try {
            if(!inputCheck(signupInput)){
                return ;
            }
            await sendSignupData(signupDataForm(signupInput))
            useModal.closeModal()
        } catch (error:any) {
            if(Array.isArray(error.response?.data.message)){
                setErrorMessage('회원가입 양식에 맞지 않습니다.')
                return ;
            }
            if(error.response?.data.message){
                setErrorMessage(error.response.data.message)
                return ;
            }
            setErrorMessage('회원가입에 실패했습니다.')
        }
    }

    
    return (
        <SignupContainer>
            <Helmet>Signup | TAG-MARK</Helmet>
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

