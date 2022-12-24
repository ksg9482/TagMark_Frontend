import { DeleteUser } from "../../blocks/userInfo/userDelete";
import { EditUserInfo } from "../../blocks/userInfo/userEdit";
import { ModalContentContainer, UserInfoModalContainer } from "./style";


interface ContentKey {
  edit:JSX.Element;
  delete:JSX.Element;
}

export const UserInfoModalPage = (props:any) => {
  const contentKey = props.contentKey;
  
  const modalContentMap:ContentKey = {
    edit:<EditUserInfo useModal={props.useModal} userData={props.userData} sendEditUserData={props.sendEditUserData}/>,
    delete: <DeleteUser useModal={props.useModal} userData={props.userData} sendDeleteUser={props.sendDeleteUser}/>
  }
  const content = (contentKey:'edit' | 'delete') => {

    return modalContentMap[contentKey]
  }

    return (
      <UserInfoModalContainer className="modal-base">
        <ModalContentContainer>
          {content(contentKey)}
        </ModalContentContainer>
      </UserInfoModalContainer>
      )
}