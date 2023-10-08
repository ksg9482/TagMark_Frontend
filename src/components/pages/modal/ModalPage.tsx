import { useState } from "react";
import { Login } from "../auth/login/Login.page";
import { Signup } from "../auth/signup/Signup.page";
import { ModalBaseContainer, ModalContentContainer } from "./style";

export const ModalPage = (props: any) => {
  const useModal = props.useModal;
  const onSignup = () => {
    setModalContent(<Signup useModal={useModal} />);
  };
  const [modalContent, setModalContent] = useState(
    <Login useModal={useModal} onSignup={onSignup} />
  );

  return (
    <ModalBaseContainer className="modal-base">
      <ModalContentContainer>{modalContent}</ModalContentContainer>
    </ModalBaseContainer>
  );
};
