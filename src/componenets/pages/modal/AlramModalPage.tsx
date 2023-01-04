import { useState } from "react";
import { Login } from "../auth/login/Login.page";
import { Signup } from "../auth/signup/Signup.page";
import { ErrorModalcontent } from "../main/Bookmark.page";
import { AlramModalContainer, AlramModalContentContainer, ModalContainer, ModalContentContainer } from "./style";




export const AlramModalPage = (props:any) => {
  const useModal = props.useModal;
  const errorMessage = props.errorMessage
  const onSignup = ()=>{
    setModalContent(<Signup useModal={useModal}/>)
  }
  const onCancle = () => {
    useModal.closeModal()
  };
  const [modalContent, setModalContent] =useState(<Login useModal={useModal} onSignup={onSignup}/>)
    
    return (
      <AlramModalContainer className="modal-base">
        <AlramModalContentContainer>
          <ErrorModalcontent errorMessage={errorMessage}/>
        <button onClick={onCancle}>확인</button>
        </AlramModalContentContainer>
      </AlramModalContainer>
      )
}