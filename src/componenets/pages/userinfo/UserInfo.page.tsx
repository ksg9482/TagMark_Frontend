import { useEffect, useState } from "react";
import styled from "styled-components";
import { customAxios } from "../../../utils/axios/customAxios";
import { secure } from "../../../utils/secure";
import { BookmarkAreaContainer, MyDataContainer, SubContainer, TagAreaContainer, UserInfoContainer } from "./style";

const dumyBookmarkCount = 21;
const dumyTagCount = 107;
const dummyUserData = {
    email: 'dumy@email.com'
}


export const UserInfo = () => {
    const secureWrap = secure().wrapper()
    const [userInfo, setUserInfo] = useState({ email: '', bookmarkCount: 0, tagCount: 0 })
    const updateUserInfo = (userInfo: any) => {
        setUserInfo(userInfo)
    }
    const getUserData = async () => {
        try {
            const userInfo = await customAxios.get(`/user`); //암호문
            secureWrap.decryptWrapper(userInfo.data)
            updateUserInfo(userInfo.data)
        } catch (error) {
            console.log(error)
        }
    }
    const sendEditUserData = async (editUser: any) => {
        try {
            const encrypted = secureWrap.encryptWrapper('test')
            const userInfo = await customAxios.patch(`/user`, { encrypted })
        } catch (error) {
            console.log(error)
        }
    }
    const sendDeleteUser = async () => {
        const userInfo = await customAxios.delete(`/user`)
    }
    useEffect(() => {
        getUserData()
    }, [userInfo])
    return (
        <UserInfoContainer>
            <BookmarkAreaContainer className="bookmark-area">
                <div>총 북마크 개수 {userInfo.bookmarkCount} </div>
                <button>북마크 가져오기 </button>
                <button>내 북마크 공유하기 </button>
                <div>북마크 DB 동기화 (자동 on/off) </div>
            </BookmarkAreaContainer>
            <SubContainer>
                <TagAreaContainer className="tag-area">
                    <div>총 태그 개수 {userInfo.tagCount}</div>
                    <div>
                        <div>태그 비율</div>
                        <div>태그 그래프 자리</div>
                    </div>
                </TagAreaContainer>
                <MyDataContainer className="userinfo-area">
                    <div>이메일 {userInfo.email}</div>
                    <button>정보변경 </button>
                    <button>회원탈퇴 </button>
                </MyDataContainer>
            </SubContainer>
        </UserInfoContainer>
    )
}

//export default BookMark