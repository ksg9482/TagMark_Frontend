import styled from "styled-components"

const BookmarkButtonContainer = styled.div`
    display: grid;
    gap: 5px;
    grid-template-rows: 1fr 1fr;
`;
const BookmarkOptionButton = styled.button`
    border: none;
    border-radius: 5px;
    width: fit-content;
`;
const BookmarkButtonBlock = (props:any) => {
    const onBookmarkDelete = props.onBookmarkDelete
    const id = props.id
    const onDelete = () => {
        onBookmarkDelete(id)
    }

    return (
        <BookmarkButtonContainer className="option">
            <BookmarkOptionButton>수정</BookmarkOptionButton>
            <BookmarkOptionButton onClick={onDelete}>삭제</BookmarkOptionButton>
        </BookmarkButtonContainer>
    )
}
export default BookmarkButtonBlock