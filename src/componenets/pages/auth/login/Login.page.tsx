import axios from "axios";
import { useState } from "react";
import { UseModal } from "../../../../interface/header";
import { secure } from "../../../../utils/secure";
import config from "../../../../config";
import { LoginContainer, LoginInput } from "./style";



//모달 변경되게
export const Login = (props: any) => {
    const onSignup = props.onSignup;
    const secureWrap = secure().wrapper()
    const secureStorage = secure().local()

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

    const OAuthButtonBlock = () => {
        return (
            <div>
                <button onClick={oauthGoogle}>구글</button>
                <button onClick={oauthKakao}>카카오</button>
            </div>
        )
    };
    const securedSendData = (data:any) => {
        return secureWrap.encryptWrapper(JSON.stringify(data))
     }
    const sendLoginData = async (sendData: any) => {
        const securedData:string = securedSendData(sendData)
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
        //서버전송. 암호문 날아감
        //const form = { email: '', password: '' }
        //const temp = secure().local().getItem('user')!
        //const encryptedSendData = secure().wrapper().encryptWrapper(sendData)
        //console.log('서버에서 받는 것', sendData)
        //console.log('서버에서 해석 email', secureWrap.decryptWrapper(sendData.email))
        //console.log('서버에서 해석 password', secureWrap.decryptWrapper(sendData.password))
    }


    return (
        <LoginContainer>
            <div>로고</div>
            <LoginBlock useModal={props.useModal} sendLoginData={sendLoginData} />
            <div onClick={onSignup}>회원가입은 여기 클릭</div>
            <OAuthButtonBlock />
        </LoginContainer>
    )
}

export const LoginBlock = (props: any) => {
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
        // eslint-disable-next-line no-restricted-globals
        location.reload()
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
