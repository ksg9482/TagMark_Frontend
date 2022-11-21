import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {BookMark, Login, Signup} from "../componenets/pages"
import { UserInfo } from "../componenets/pages/userinfo/userinfo.page";

export const LoggedOutRouter = (props: any) => {
    const { oauthLoginIsTrue } = props;
//가입, 로그인창은 모달로 나옴->같은 모달 규격 공유. baseModal 만들고 HOC로 묶기
    return (
        <Router>
            {/* <Header isLogin={false} /> */}
            <Routes>
                {/* <Route path="/" element={<Login />} /> */}
                <Route path="/" element={<BookMark />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/me" element={<UserInfo />} />
            </Routes>
        </Router>
    )
}