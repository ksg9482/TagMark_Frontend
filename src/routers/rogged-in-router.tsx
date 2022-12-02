import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { BookMark } from "../componenets/pages";
import { UserInfo } from "../componenets/pages/userinfo/UserInfo.page";


export const LoggedInRouter = () => {
    const isLogin = true
    return (
            <Routes>
                {/* <Route path="/" element={<Login />} /> */}
                <Route path="/" element={<BookMark isLogin={isLogin} />} />
                <Route path="/me" element={<UserInfo />} />
            </Routes>
    );
};