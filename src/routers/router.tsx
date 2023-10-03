import React, { useEffect, useState } from "react";
import { LoggedInRouter } from './rogged-in-router';
import { LoggedOutRouter } from './rogged-out-router';
import { useSelector } from "react-redux";
import { RootState } from "../store";
const Router = () => {
  const login = useSelector((state: RootState) => {
      return state.user.islogin
  });
  const [isOauthLoggedIn, setIsOauthLoggedIn] = useState(false);
  const oauthLoginIsTrue = () => {
    setIsOauthLoggedIn(true)
  }
  const loginCheck = () => {
    return isOauthLoggedIn || login ? true : false
  }
  useEffect(() => {
  },
    [isOauthLoggedIn])

  return (
    loginCheck()
      ? <LoggedInRouter />
      : <LoggedOutRouter oauthLoginIsTrue={oauthLoginIsTrue} />
  );
}

export default Router;