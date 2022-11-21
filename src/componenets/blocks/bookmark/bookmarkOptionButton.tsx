import styled from "styled-components"

const BookmarkButtonContainer = styled.div`
    display: grid;
    gap: 5px;
    grid-template-rows: 1fr 1fr;
`
const BookmarkOptionButton = styled.button`
    border-radius: 5px;
    width: fit-content;
`
const BookmarkButtonBlock = () => {
    return (
        <BookmarkButtonContainer className="option">
            <BookmarkOptionButton>수정</BookmarkOptionButton>
            <BookmarkOptionButton>삭제</BookmarkOptionButton>
        </BookmarkButtonContainer>
    )
}
export default BookmarkButtonBlock