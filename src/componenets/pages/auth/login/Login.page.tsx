import axios from "axios";
import { useState } from "react";
import { secure } from "../../../../utils/secure";
import config from "../../../../config";
import { CommonButtonContainer, MoveSignupPage, ModalTitle } from "./style";
import { LoginBlock } from "../../../blocks/auth/login/login.block";
import { OAuthButtonBlock } from "../../../blocks/auth/login/OAuthButton.block";
import styled from "styled-components";



//모달 변경되게
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


  const securedSendData = (data: any) => {
    return secureWrap.encryptWrapper(JSON.stringify(data))
  }
  const sendLoginData = async (sendData: any) => {
    const securedData: string = securedSendData(sendData)
    try {
      const userLogin = await axios.post(
        `${config.SERVER_HOST}/api/user/login`,
        sendData,
        { withCredentials: true }
      );
      //이거 한세트로 함수만드는게 나은듯? 어차피 응답오면 복호화하고 객체로 되돌려야 함
      const user = JSON.parse(secureWrap.decryptWrapper(userLogin.data.user))
      //어차피 토큰은 암호화되어 온다
      localStorage.setItem('accessToken', userLogin.data['accessToken'])
      // eslint-disable-next-line no-restricted-globals
      //location.reload()
    } catch (error) {
      console.log(error)
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
      <ContentTop>
        <div id="title">Login</div>
        <CommonButton id="exit" onClick={onClose}>X</CommonButton>
      </ContentTop>
      <ContentBody>
        <ModalTitle>TAG MARK 로그인</ModalTitle>
        <LoginBlock useModal={props.useModal} onClose={onClose} errorMessage={errorMessage} updateErrorMessage={updateErrorMessage} sendLoginData={sendLoginData} />
        <MoveSignupPage id="move-signup" onClick={onSignup}>회원가입은 여기를 클릭해 주세요</MoveSignupPage>
        <div id="social-login">
        <div>소셜 로그인</div>
        <CommonButtonContainer>
          <OAuthButtonBlock oauthGoogle={oauthGoogle} oauthKakao={oauthKakao} />
        </CommonButtonContainer>
        </div>
      </ContentBody>
    </LoginContent>
  )
}
export const ContentTop = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid;
  border-color: #c5c5c5;
  padding: 8px 10px 8px 10px;
  margin: 0 0 100px 0;
  
  height: fit-content;
  #title {
    justify-self: left;
    
    height: fit-content;
  }
  #exit {
    justify-self: end;
  }
`;
export const ContentBody = styled.div`
  display: grid;
  grid-template-rows: min-content min-content min-content auto;
  justify-items: center;
  justify-self: center;
  //align-self: center;
  align-items: center;
  //align-content: center;
  width: 400px;
  #move-signup {
    align-self: flex-start;
    margin-bottom: 20px;
  }
  #social-login{
    align-self: flex-start;
  }
`;
export const LoginContent = styled.div`
  display: grid;
  grid-template-rows: min-content auto;
  height: 700px;
  width: 500px;
`;
export const CommonButton = styled.button`
    white-space: nowrap;
    min-width: fit-content;
    
    height: fit-content;
`;

