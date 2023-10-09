import { useState } from "react";
import { useSelector } from "react-redux";
import { UseModal } from "../../../interface/header";
import { RootState } from "../../../store";
import { secure } from "../../../utils/secure";
import { ContentBody, ErrorMessageBlock, UserEditContainer } from "./style";
import {
  CommonButton,
  CommonButtonContainer,
  CommonInput,
  CommonInputContainer,
} from "../../common/style";
import { deepCopy } from "../../../utils";
import { ModalContentTop, ModalTitleLong } from "../../pages/modal/style";

type EditKey = "nickName" | "password" | "passwordCheck";

export const EditUserInfo = (props: any) => {
  const useModal: UseModal = props.useModal;
  const propsErrorMessage = props.errorMessage;

  const userData = useSelector((state: RootState) => {
    return {
      email: state.user.email,
      nickname: state.user.nickname,
      type: state.user.type,
      bookmarkCount: state.user.bookmarkCount,
      tagCount: state.user.tagCount,
    };
  });
  const secureWrap = secure().wrapper();
  const sendEditUserData = props.sendEditUserData;
  const [editInput, setEditInput] = useState({
    nickName: secureWrap.encryptWrapper(userData.nickname),
    password: "",
    passwordCheck: "",
  });
  const [errorMessage, setErrorMessage] = useState(propsErrorMessage);

  const onEditInput =
    (key: EditKey) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      if (e.target.value.length <= 0) {
        setEditInput({ ...editInput, [key]: "" });
      } else {
        setEditInput({
          ...editInput,
          [key]: secureWrap.encryptWrapper(e.target.value),
        });
      }
    };

  const onClose = () => {
    useModal.closeModal();
  };

  const passwordValid = () => {
    const copy = deepCopy(editInput);
    copy.password = secureWrap.decryptWrapper(editInput.password);
    copy.passwordCheck = secureWrap.decryptWrapper(editInput.passwordCheck);
    if (copy.password !== copy.passwordCheck) {
      return false;
    }
    return true;
  };
  const onEdit = () => {
    if (!passwordValid()) {
      updateErrorMessage("비밀번호와 확인이 맞지 않습니다.");
      return false;
    }
    let editData: any = {};
    if (secureWrap.decryptWrapper(editInput.nickName).length > 0) {
      editData.nickname = secureWrap.decryptWrapper(editInput.nickName);
    }
    if (secureWrap.decryptWrapper(editInput.password).length > 0) {
      editData.password = secureWrap.decryptWrapper(editInput.password);
    }
    Reflect.deleteProperty(editData, "passwordCheck");

    sendEditUserData(editData);
    useModal.closeModal();
  };

  const updateErrorMessage = (message: string) => {
    setErrorMessage(message);
  };

  return (
    <UserEditContainer>
      <ModalContentTop>
        <div id="title">User Edit</div>
        <CommonButton id="exit" onClick={onClose}>
          X
        </CommonButton>
      </ModalContentTop>
      <ContentBody>
        <ModalTitleLong>유저정보 변경</ModalTitleLong>
        {userData.type === "BASIC" ? (
          <CommonInputContainer>
            <CommonInput>
              <div>닉네임변경</div>
              <input
                type="text"
                placeholder="닉네임"
                onChange={onEditInput("nickName")}
                defaultValue={secureWrap.decryptWrapper(editInput.nickName)}
              />
            </CommonInput>
            <CommonInput>
              <div>비밀번호변경</div>
              <input
                type="password"
                placeholder="비밀번호변경"
                onChange={onEditInput("password")}
                defaultValue={editInput.password}
              />
            </CommonInput>
            <CommonInput>
              <div>비밀번호확인</div>
              <input
                type="password"
                placeholder="비밀번호확인"
                onChange={onEditInput("passwordCheck")}
                defaultValue={editInput.passwordCheck}
              />
            </CommonInput>
          </CommonInputContainer>
        ) : (
          <CommonInputContainer>
            <CommonInput>
              <div>닉네임변경</div>
              <input
                type="text"
                placeholder="닉네임"
                onChange={onEditInput("nickName")}
                defaultValue={secureWrap.decryptWrapper(editInput.nickName)}
              />
            </CommonInput>
          </CommonInputContainer>
        )}
        {errorMessage ? (
          <ErrorMessageBlock>{errorMessage}</ErrorMessageBlock>
        ) : (
          <ErrorMessageBlock>&nbsp;</ErrorMessageBlock>
        )}
        <CommonButtonContainer>
          <CommonButton onClick={onEdit}>확인</CommonButton>
          <CommonButton onClick={onClose}>취소</CommonButton>
        </CommonButtonContainer>
      </ContentBody>
    </UserEditContainer>
  );
};
