import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BookMark from "../componenets/pages/main/bookmark.page";

export const LoggedOutRouter = (props: any) => {
    const { oauthLoginIsTrue } = props;

    return (
        <Router>
            {/* <Header isLogin={false} /> */}
            <Routes>
                {/* <Route path="/" element={<Login />} /> */}
                <Route path="/" element={<BookMark />} />
            </Routes>
        </Router>
    )
}