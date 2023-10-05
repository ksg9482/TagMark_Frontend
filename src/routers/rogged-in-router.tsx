import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { BookMark } from "../components/pages";
import { UserInfo } from "../components/pages/userinfo/UserInfo.page";


export const LoggedInRouter = () => {
    return (
            <Routes>
                {/* <Route path="/" element={<Login />} /> */}
                <Route path="/" element={<BookMark/>} />
                <Route path="/me" element={<UserInfo />} />
            </Routes>
    );
};