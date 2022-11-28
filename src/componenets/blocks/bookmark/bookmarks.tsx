import styled from "styled-components"
import { Bookmark } from "../../../interface/bookmark"
import BookmarkComponent from "./bookmarkComponent"

const BookmarksContainer = styled.div`
    display: grid;
    gap: 5px;
`;


//20개씩 묶기. 페이지네이션
const Bookmarks = (props: any) => {
    const bookmarks: Bookmark[] = props.bookmarks
    return (
        <BookmarksContainer>
            {bookmarks.map((bookmark: Bookmark) => (
                <BookmarkComponent bookmark={bookmark} key={bookmark.id} getTagBookmark={props.getTagBookmark}/>
            ))}
            <PageMoveBlock count={bookmarks.length} />
        </BookmarksContainer>
    )
}

export default Bookmarks

const PageNumComponent = (props: any) => {
    const arrNum = props.arrNum
    return (
        <div>
            {arrNum}
        </div>
    )
}
const PageNumsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
`;
const Numbers = (props: any) => {
    const buttonCount = props.buttonCount
    const arr = new Array(buttonCount).fill(0).map((data, i) => { return i + 1 })

    return (
        <PageNumsContainer>{
            arr.map((arrNum, i:number) => {
                return (
                    <PageNumComponent arrNum={arrNum} key={i} />
                )
            })
        }</PageNumsContainer>
    )
}




const PageButtonsContainer = styled.div`
    display: grid;
    grid-template-columns: 15% 15% 40% 15% 15%;
`;
//5개 이하 -> 1부터5, 현재5페이지 -> 맨앞 이전...3,4,5,6,7...다음 맨 뒤
//로그인시 -> 버튼누르면 그 페이지 페이지네이션 가져오기
//비로그인 -> 로컬스토리지에서 슬라이스해서 가져오기
const PageMoveBlock = (props: any) => {
    const bookmarkMax = 20;
    const count = props.count;
    const buttonCount = Math.ceil(count / bookmarkMax);

    return (
        <PageButtonsContainer>
            <div>맨앞</div>
            <div>이전</div>
            <Numbers buttonCount={buttonCount} />
            <div>이후</div>
            <div>맨뒤</div>
        </PageButtonsContainer>
    )
};