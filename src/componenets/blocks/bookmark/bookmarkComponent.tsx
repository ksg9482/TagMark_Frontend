import styled from "styled-components"
import Tags from "../tag/tags"
import BookmarkButtonBlock from "./bookmarkOptionButton"
const BookmarkComponentContainer = styled.div`
    border: 1px solid;
`
const BookmarkComponent = (props: any) => {
    const bookmark = props.bookmark
    const tags = bookmark.tags
    const bookmarkSlug = bookmark.domain + bookmark.path
    return (
        <BookmarkComponentContainer>
            <div>{bookmarkSlug}</div>
            <div><Tags tags={tags}/></div>
            <div><BookmarkButtonBlock /> </div>
        </BookmarkComponentContainer>

    )
}

export default BookmarkComponent