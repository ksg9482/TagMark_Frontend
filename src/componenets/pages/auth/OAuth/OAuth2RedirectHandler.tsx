import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OauthErrorModal from "./OauthErrorModal";
import config from "../../../../config";

const getToken = (key:string) => {
  return localStorage.getItem(key) || 'token not found'
  }
const OAuth2RedirectHandler = (props: any) => {

  const HOST = config.SERVER_HOST;


  const { oauthLoginIsTrue } = props;
  const [onModal, setOnModal] = useState(false);

  const navigate = useNavigate();
  const oauthPath = new URL(window.location.href).pathname.split("/");
  const oAuthNav = () => {
    oauthLoginIsTrue()
    navigate("/", { replace: true, state: { isLoginTrue: true } });
    // eslint-disable-next-line no-restricted-globals
    location.reload(); //새로고침해서 axios인스턴스 재생성. 맨처음 생성은 토큰이 안들어가 있다
  }

  async function handle() {
    
    if (oauthPath.includes("kakao")) {
      try {
        const code = new URL(window.location.href).searchParams.get("code");
        const sendCode = await axios.get(
          `${HOST}/api/auth/kakao?code=${code}`,
          { 
            withCredentials: true,
            headers: { Authorization: `Bearer ${getToken('accessToken')}`}
           }
        );
        window.localStorage.setItem('accessToken', sendCode.data.accessToken);
        return oAuthNav();
      } catch (error) {
        return error;
      }
    }

    if (oauthPath.includes("google")) {
      try {
        const getGoogleAccessToken = () => {
          const parsedHash = new URLSearchParams(
            window.location.hash.substring(1)
          );
          const accessToken = parsedHash.get("access_token");
          return accessToken;
        }
        const accessToken = getGoogleAccessToken()
        const sendCode = await axios.post(
          `${HOST}/api/auth/google`,
          { accessToken: accessToken },
          { 
            withCredentials: true,
            headers: { Authorization: `Bearer ${getToken('accessToken')}`}
          }
        );
        window.localStorage.setItem('accessToken', sendCode.data.accessToken);
        return oAuthNav();
      } catch (error: any) {
        return setOnModal(true);
      }
    }
  }
  useEffect(() => {
    handle();
  }, []);

  return <div>
    {onModal ? <OauthErrorModal /> : null}
  </div>;
};

export default OAuth2RedirectHandler;
