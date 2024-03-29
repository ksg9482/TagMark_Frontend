import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { BookMark, Login, Signup } from "../components/pages";
import OAuth2RedirectHandler from "../components/pages/auth/OAuth/OAuth2RedirectHandler";
import { UserInfo } from "../components/pages/userinfo/UserInfo.page";

export const LoggedOutRouter = (props: any) => {
  const { oauthLoginIsTrue } = props;
  return (
    <Routes>
      <Route path="/" element={<BookMark/>} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/oauth/callback/*"
        element={<OAuth2RedirectHandler oauthLoginIsTrue={oauthLoginIsTrue} />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/me" element={<UserInfo />} />
    </Routes>
  );
};
