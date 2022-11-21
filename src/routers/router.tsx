import React, { useEffect, useState } from "react";
import { LoggedInRouter } from './rogged-in-router'
import { LoggedOutRouter } from './rogged-out-router'
const Router = (isLoggedIn: boolean) => {
  const [isOauthLoggedIn, setIsOauthLoggedIn] = useState(false);
  const oauthLoginIsTrue = () => {
    setIsOauthLoggedIn(true)
  }
  const loginCheck = () => {
    return isOauthLoggedIn || isLoggedIn ? true : false
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