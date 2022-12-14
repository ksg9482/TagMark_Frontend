import axios from "axios";
import { useState } from "react";
import { secure } from "../../../../utils/secure";
import config from "../../../../config";
import { CommonButtonContainer, MoveSignupPage, ModalTitle } from "./style";
import { LoginBlock } from "../../../blocks/auth/login/login.block";
import { OAuthButtonBlock } from "../../../blocks/auth/login/OAuthButton.block";



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

  const updateErrorMessage = (message:string) => {
    setErrorMessage(message)
  }

  return (
    <div>
      <ModalTitle>로그인</ModalTitle>
      <LoginBlock useModal={props.useModal} errorMessage={errorMessage} updateErrorMessage={updateErrorMessage} sendLoginData={sendLoginData} />
      <MoveSignupPage onClick={onSignup}>회원가입은 여기를 클릭해 주세요</MoveSignupPage>
      <CommonButtonContainer>
        <OAuthButtonBlock oauthGoogle={oauthGoogle} oauthKakao={oauthKakao} />
      </CommonButtonContainer>
    </div>
  )
}


