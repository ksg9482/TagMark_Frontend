import styled from "styled-components";
import { BookmarkAreaContainer, MyDataContainer, SubContainer, TagAreaContainer, UserInfoContainer } from "./style";

const dumyBookmarkCount = 21;
const dumyTagCount = 107;
const dummyUserData = {
    email:'dumy@email.com'
}


export const UserInfo = () => {
    return (
        <UserInfoContainer>
            <BookmarkAreaContainer className="bookmark-area">
                <div>총 북마크 개수 {dumyBookmarkCount} </div>
                <button>북마크 가져오기 </button>
                <button>내 북마크 공유하기 </button>
                <div>북마크 DB 동기화 (자동 on/off) </div>
            </BookmarkAreaContainer>
            <SubContainer>
                <TagAreaContainer className="tag-area">
                    <div>총 태그 개수 {dumyTagCount}</div>
                    <div>
                        <div>태그 비율</div>
                        <div>태그 그래프 자리</div>
                    </div>
                </TagAreaContainer>
                <MyDataContainer className="userinfo-area">
                    <div>이메일 {dummyUserData.email}</div>
                    <button>정보변경 </button>
                    <button>회원탈퇴 </button>
                </MyDataContainer>
            </SubContainer>
        </UserInfoContainer>
    )
}

//export default BookMark