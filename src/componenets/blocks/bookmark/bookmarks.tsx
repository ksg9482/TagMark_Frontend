import styled from "styled-components"
import { Bookmark } from "../../../interface/bookmark"
import BookmarkComponent from "./bookmarkComponent"

const BookmarksContainer = styled.div`
    display: grid;
    gap: 5px;
`;
//20개씩 묶기. 페이지네이션
const Bookmarks = (props: any) => {
    const bookmarks = props.bookmarks
    return (
        <BookmarksContainer>
            {bookmarks.map((bookmark: Bookmark) => (
                <BookmarkComponent bookmark={bookmark} key={bookmark.id} />
            ))}
            이전 1,2,3,4,5 다음
        </BookmarksContainer>
    )
}

export default Bookmarks