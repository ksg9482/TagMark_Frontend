import { useState } from "react";
import { Login } from "../auth/login/Login.page";
import { Signup } from "../auth/signup/Signup.page";
import { AlramModalContainer, AlramModalContentContainer, ModalContainer, ModalContentContainer } from "./style";




export const AlramModalPage = (props: any) => {
  const useModal = props.useModal;
  const errorMessage = props.errorMessage

  const onCancle = () => {
    useModal.closeModal()
  };
  const ErrorModalcontent = (props: any) => {
    const errorMessage = props.errorMessage;
    return (
      <div>
        {errorMessage}
      </div>
    );
  };

  return (
    <AlramModalContainer className="modal-base">
      <AlramModalContentContainer>
        <ErrorModalcontent errorMessage={errorMessage} />
        <button onClick={onCancle}>확인</button>
      </AlramModalContentContainer>
    </AlramModalContainer>
  );
}