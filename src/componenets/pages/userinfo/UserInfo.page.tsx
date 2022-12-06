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
    const [userInfo, setUserInfo] = useState({ email: '', nickname:'', bookmarkCount: 0, tagCount: 0 })
    const [tagCount, setTagCount] = useState([{id:0, tag:'', count:''}])
    const updateUserInfo = (userInfo: any) => {
        setUserInfo(userInfo)
    }
    const sendGetUserInfo = async () => {
        return await customAxios.get(`/user`)
    }
    const sendGetBookmarkCount = async () => {
        return await customAxios.get(`/bookmark/count`)
    }
    const sendGetTagCount = async () => {
        return await customAxios.get(`/tag`)
    }
    //객체 내용물을 재귀를 통해 암호화함
    const encryptWrapper = (data:any) => {

    }
    const updateTagCount = (tagCount:any) => {
        setTagCount(tagCount)
    }
    const getUserInfo = async () => {
        try {
            const userInfo = await sendGetUserInfo(); //암호문
            const bookmarkCount = await sendGetBookmarkCount()
            const tagCount = await sendGetTagCount()
            //console.log(secureWrap.decryptWrapper(userInfo.data.user))
            const user = JSON.parse(secureWrap.decryptWrapper(userInfo.data.user))
            encryptWrapper('')
            updateUserInfo({email:user.email,nickname:user.nickname, bookmarkCount:bookmarkCount.data.count, tagCount:tagCount.data.tags.length})
            updateTagCount(tagCount.data.tags)
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
        getUserInfo()
    }, [])
    //console.log(userInfo)
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
                        {tagCount.map((tag)=>{
                            return (
                                <div key={tag.id}>
                                <span>{tag.tag}</span>
                                <span>{tag.count}</span>
                                </div>
                            )
                        })}
                        <div>태그 그래프 자리</div>
                    </div>
                </TagAreaContainer>
                <MyDataContainer className="userinfo-area">
                    <div>이메일 {userInfo.email}</div>
                    <div>닉네임 {userInfo.nickname}</div>
                    <button>정보변경 </button>
                    <button>회원탈퇴 </button>
                </MyDataContainer>
            </SubContainer>
        </UserInfoContainer>
    )
}

//export default BookMark