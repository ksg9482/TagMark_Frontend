import React from "react";
import { Helmet } from "react-helmet-async";
import { LoadingBarConainer } from "./style";
export const LoadingBar = () => {
    return (
      <LoadingBarConainer>
        <Helmet>TagMark | TAG-MARK</Helmet>
        <div className="loading">
        <span></span>
        <span></span>
        <span></span>
        </div>
      </LoadingBarConainer>
    )
  }

