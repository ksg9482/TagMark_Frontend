import styled from "styled-components"
import { Bookmark } from "../../../interface/bookmark"
import BookmarkComponent from "./BookmarkComponent"
import { BookmarksContainer } from "./style"




//20개씩 묶기. 페이지네이션
const Bookmarks = (props: any) => {
    const bookmarkView: Bookmark[] = props.bookmarkView
    console.log(bookmarkView)
    
    return (
        <BookmarksContainer>
            {bookmarkView.map((bookmark: Bookmark) => (
                <BookmarkComponent id={bookmark.id} bookmark={bookmark} key={bookmark.id} getTagBookmark={props.getTagBookmark} onBookmarkDelete={props.onBookmarkDelete} editSave={props.editSave}/>
            ))}
        </BookmarksContainer>
    )
}

export default Bookmarks

//5개 이하 -> 1부터5, 현재5페이지 -> 맨앞 이전...3,4,5,6,7...다음 맨 뒤
//로그인시 -> 버튼누르면 그 페이지 페이지네이션 가져오기
//비로그인 -> 로컬스토리지에서 슬라이스해서 가져오기
