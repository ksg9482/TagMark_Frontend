import { CommonButton } from "../../common/style"
import { BookmarkManagebuttonContainer, ManageButtonContainer } from "../../pages/main/styles"

export const BookmarkManageButtonBlock = (props:any) => {
    const buttonFn = props.buttonFn
    return (
      <BookmarkManagebuttonContainer>
              <div></div>
              <ManageButtonContainer>
                <CommonButton onClick={buttonFn.bookmarkRefresh}>초기화</CommonButton>
                <CommonButton onClick={buttonFn.bookmarkCreate}>북마크생성</CommonButton>
              </ManageButtonContainer>
            </BookmarkManagebuttonContainer>
    )
  }