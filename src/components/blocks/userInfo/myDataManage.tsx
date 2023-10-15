import { useSelector } from "react-redux";
import { CommonButton } from "../../common/style";
import {
  MyDataButtonContainer,
  MyDataContainer,
  MyInfoContainer,
} from "./style";
import { RootState } from "../../../store";

export const MyDataManageBlock = (props: any) => {
  const myInfo = useSelector((state: RootState) => {
    return {
      email: state.user.email,
      nickname: state.user.nickname,
      type: state.user.type,
    };
  });
  return (
    <MyDataContainer className="userinfo-area">
      <div>내 정보</div>
      <MyInfoContainer>
        <div className="email-info">
          <div>이메일 : {myInfo.email}</div>
          {myInfo.type !== "BASIC" ? (
            <div>소셜로그인입니다</div>
          ) : (
            <div>&nbsp;</div>
          )}
        </div>
        <div>닉네임 : {myInfo.nickname}</div>
      </MyInfoContainer>
      <MyDataButtonContainer>
        <CommonButton
          className="edit-button"
          onClick={(e) => props.modalHandle.openModal("edit")}
        >
          정보변경{" "}
        </CommonButton>
        <CommonButton
          className="delete-button"
          onClick={(e) => props.modalHandle.openModal("delete")}
        >
          회원탈퇴{" "}
        </CommonButton>
      </MyDataButtonContainer>
    </MyDataContainer>
  );
};
