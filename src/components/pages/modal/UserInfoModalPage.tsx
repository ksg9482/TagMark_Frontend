import { DeleteUser } from "../../blocks/userInfo/userDelete";
import { EditUserInfo } from "../../blocks/userInfo/userEdit";
import { ModalContentContainer, ModalBaseContainer } from "./style";

interface ContentKey {
  edit: JSX.Element;
  delete: JSX.Element;
}

export const UserInfoModalPage = (props: any) => {
  const contentKey = props.contentKey;

  const modalContentMap: ContentKey = {
    edit: (
      <EditUserInfo
        useModal={props.useModal}
        sendEditUserData={props.sendEditUserData}
      />
    ),
    delete: (
      <DeleteUser
        useModal={props.useModal}
        sendDeleteUser={props.sendDeleteUser}
      />
    ),
  };
  const content = (contentKey: "edit" | "delete") => {
    return modalContentMap[contentKey];
  };

  return (
    <ModalBaseContainer className="modal-base">
      <ModalContentContainer>{content(contentKey)}</ModalContentContainer>
    </ModalBaseContainer>
  );
};
