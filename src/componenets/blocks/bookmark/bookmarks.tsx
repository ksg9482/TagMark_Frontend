import styled from "styled-components"
import { Bookmark } from "../../../interface/bookmark"
import BookmarkComponent from "./bookmarkComponent"

const BookmarksContainer = styled.div`
   
`
const Bookmarks = (props: any) => {
    const bookmarks = props.bookmarks
    return (
        <BookmarksContainer>
            {bookmarks.map((bookmark: Bookmark) => (
                <BookmarkComponent bookmark={bookmark} key={bookmark.id} />
            ))}
        </BookmarksContainer>
    )
}

export default Bookmarks