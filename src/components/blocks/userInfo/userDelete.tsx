import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UseModal } from "../../../interface/header";
import { RootState } from "../../../store";
import { secure } from "../../../utils/secure";
import {
  ContentBody,
  ErrorMessageBlock,
  TextContainer,
  UserDeleteContainer,
} from "./style";
import {
  CommonButton,
  CommonInput,
  CommonButtonContainer,
} from "../../common/style";
import { ModalContentTop, ModalTitleLong } from "../../pages/modal/style";

export const DeleteUser = (props: any) => {
  const useModal: UseModal = props.useModal;
  const secureWrap = secure().wrapper();
  const sendDeleteUser = props.sendDeleteUser;

  const userData = useSelector((state: RootState) => {
    return {
      email: state.user.email,
      nickname: state.user.nickname,
      type: state.user.type,
      bookmarkCount: state.user.bookmarkCount,
      tagCount: state.user.tagCount,
    };
  });
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onDeleteInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPassword(secureWrap.encryptWrapper(e.target.value));
  };

  const onClose = () => {
    useModal.closeModal();
  };

  const onDelete = async () => {
    const result = await sendDeleteUser(secureWrap.decryptWrapper(password));

    if (result.error) {
      updateErrorMessage(result.error);
      return;
    }
    localStorage.removeItem("accessToken");
    useModal.closeModal();
    navigate("/", { replace: true, state: { isLoginTrue: false } });
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };

  const updateErrorMessage = (message: string) => {
    setErrorMessage(message);
  };
  return (
    <UserDeleteContainer>
      <ModalContentTop>
        <div id="title">User Delete</div>
        <CommonButton id="exit" onClick={onClose}>
          X
        </CommonButton>
      </ModalContentTop>
      <ContentBody>
        <ModalTitleLong>회원 탈퇴</ModalTitleLong>
        <TextContainer>
          <div>아이디를 삭제하시려면 비밀번호를 입력해주세요.</div>
          <div>
            소셜로그인의 경우 비밀번호 확인과정 없이 회원탈퇴가 진행됩니다.
          </div>
        </TextContainer>
        {userData.type === "BASIC" ? (
          <CommonInput>
            <div>비밀번호</div>
            <input
              type="password"
              onChange={onDeleteInput}
              placeholder="비밀번호"
            />
          </CommonInput>
        ) : null}
        {errorMessage ? (
          <ErrorMessageBlock>{errorMessage}</ErrorMessageBlock>
        ) : (
          <ErrorMessageBlock>&nbsp;</ErrorMessageBlock>
        )}
        <CommonButtonContainer>
          <CommonButton onClick={onDelete}>확인</CommonButton>
          <CommonButton onClick={onClose}>취소</CommonButton>
        </CommonButtonContainer>
      </ContentBody>
    </UserDeleteContainer>
  );
};
