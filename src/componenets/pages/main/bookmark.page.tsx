import { useEffect, useState } from "react";
import styled from "styled-components";
import { dumyBookmark } from "../../../dumy/dumy-bookmarks";
import { dumyTags } from "../../../dumy/dumy-tags";
import { Bookmark } from "../../../interface/bookmark";
import Bookmarks from "../../blocks/bookmark/bookmarks";
import SideBar from "../../blocks/sidebar/sidebar";

const TagComponent = (props: any) => {
    const tag = props.tag;
    return (
        <button>{tag.name}</button>
    )
}
//이거 북마크 태그 컴포넌트와 얼만큼 겹치는지?
const Tags = (props: any) => {
    const tags = props.tags
    return (
        <div>{tags.map((tag: Bookmark) => (
            <TagComponent tag={tag} key={tag.id} />
        ))}</div>
    )
}
const EditTags = (props: any) => {
    return (
        <div><Tags tags={props.tags} /></div>
    )
}

const BookMarkEdit = () => {
    return (<div>
        <textarea defaultValue={'북마크가 여기 써져있어야 함'}></textarea>
        <div>
            <EditTags tags={dumyTags} />
        </div>
    </div>)
}

const BookmarkContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 20% auto;
`;

const BookmarkManageContainer = styled.div`
  display: grid;
  grid-template-rows: 50px auto;
`;

const BookmarkManagebuttonContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 25% 25%;
`;

export const BookMark = (props:any) => {
    const isLogin = false//props.isLogin 
    //let bookmarks: Bookmark[];
    const [bookmarks, setBookmarks] = useState(
        [{
            id: 0,
            url: '',
            tags: [{
                id: 0,
                name: ''
            }]
        }]
    );

    const getBookmark = async (isLogin:boolean) =>{
        //로컬 스토리지에서
        if(!isLogin) {
            return setBookmarks(dumyBookmark)
        } 
        else {
            //서버 연결
            return setBookmarks(dumyBookmark)
        }
    }

    
    useEffect(()=>{
        getBookmark(isLogin)
    })
    return (
        <BookmarkContainer>
            <SideBar />
            <div></div>
            <BookmarkManageContainer>
                <BookmarkManagebuttonContainer>
                    <div></div>
                    <button>북마크 전체보기</button>
                    <button>북마크 생성</button>
                </BookmarkManagebuttonContainer>
                <Bookmarks bookmarks={bookmarks} />
            </BookmarkManageContainer>
        </BookmarkContainer>
    )
}



//export default BookMark