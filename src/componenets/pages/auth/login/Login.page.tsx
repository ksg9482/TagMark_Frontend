import axios from "axios";
import { useState } from "react";
import { secure } from "../../../../utils/secure";
import config from "../../../../config";
import {  MoveSignupPage, ModalTitle, LoginContent, ContentTop, CommonButton, ContentBody } from "./style";
import { LoginBlock } from "../../../blocks/auth/login/login.block";
import { OAuthButtonBlock } from "../../../blocks/auth/login/OAuthButton.block";
import { Helmet } from "react-helmet-async";

export const Login = (props: any) => {
  const onSignup = props.onSignup;
  const secureWrap = secure().wrapper()
  const [errorMessage, setErrorMessage] = useState('')
  const oauthGoogle = () => {
    const googleHost = "accounts.google.com";
    const googleParametor = {
      client_id: config.GOOGLE_CLIENT_ID,
      redirect_uri: config.GOOGLE_REDIRECT_URI,
      scope_email: "https://www.googleapis.com/auth/userinfo.email",
    };
    const googleOAuthURL =
      `https://${googleHost}/o/oauth2/v2/auth?` +
      `client_id=${googleParametor.client_id}&` +
      `redirect_uri=${googleParametor.redirect_uri}&` +
      `response_type=token&` +
      `scope=${googleParametor.scope_email}`;
    window.location.href = googleOAuthURL;
  };
  
  
  const oauthKakao = () => {
    const kakaoHost = "kauth.kakao.com";
    const kakaoParametor = {
      clientid: config.KAKAO_REST_API_KEY,
      redirect_uri: config.KAKAO_REDIRECT_URI,
    };
    const kakaoOAuthURL =
      `https://${kakaoHost}/oauth/authorize?` +
      `clientid=${kakaoParametor.clientid}` +
      `&redirect_uri=${kakaoParametor.redirect_uri}` +
      `&response_type=code`;

    window.location.href = kakaoOAuthURL;
  };

  const sendLoginData = async (sendData: any) => {
    try {
      const userLogin = await axios.post(
        `${config.SERVER_HOST}/api/user/login`,
        sendData,
        { withCredentials: true }
      );
      
      localStorage.setItem('accessToken', userLogin.data['accessToken'])
      // eslint-disable-next-line no-restricted-globals
      location.reload()
      useModal.closeModal()
    } catch (error:any) {
      if(error.response.data.message){
        updateErrorMessage(error.response.data.message)
        return ;
      }
      updateErrorMessage('로그인 할 수 없습니다.')
    }
  }

  const updateErrorMessage = (message: string) => {
    setErrorMessage(message)
  }
  const useModal = props.useModal;
  const onClose = () => {
    useModal.closeModal()
  };

  return (
    <LoginContent>
      <Helmet>Login | TAG-MARK</Helmet>
      <ContentTop>
        <div id="title">Login</div>
        <CommonButton id="exit" onClick={onClose}>X</CommonButton>
      </ContentTop>
      <ContentBody>
        <ModalTitle>TAG MARK 로그인</ModalTitle>
        <LoginBlock useModal={props.useModal} onClose={onClose} errorMessage={errorMessage} updateErrorMessage={updateErrorMessage} sendLoginData={sendLoginData} />
        <MoveSignupPage id="move-signup" onClick={onSignup}>회원가입은 여기를 클릭해 주세요</MoveSignupPage>
        <div id="social-login">
            <OAuthButtonBlock oauthGoogle={oauthGoogle} oauthKakao={oauthKakao} />
        </div>
      </ContentBody>
    </LoginContent>
  )
}

