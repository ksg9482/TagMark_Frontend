import styled from "styled-components"
import { BookmarkOptionButton, BookmarkOptionButtonsContainer } from "./style"


const BookmarkOptionButtons = (props:any) => {
    const onBookmarkDelete = props.onBookmarkDelete;
    const bookmark = props.bookmark;
    const editFocus = props.editFocus
    const onDelete = () => {
        onBookmarkDelete(bookmark.id)
    }
    const onEdit = () => {
        console.log(bookmark)
        editFocus()
    }

    return (
        <BookmarkOptionButtonsContainer className="option">
            <BookmarkOptionButton onClick={onEdit}>수정</BookmarkOptionButton>
            <BookmarkOptionButton onClick={onDelete}>삭제</BookmarkOptionButton>
        </BookmarkOptionButtonsContainer>
    )
}
export default BookmarkOptionButtons