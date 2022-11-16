import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { BookMark } from "../componenets/pages";


export const LoggedInRouter = () => {
    return (
        <Router>
            {/* <Header isLogin={true}/> */}
            <Routes>
                {/* <Route path="/" element={<Diary />} /> */}
                {/* <Route path="/" element={<BookMark />} /> */}
            </Routes>
        </Router>
    );
};