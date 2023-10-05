import { useState } from "react";
import { Login } from "../auth/login/Login.page";
import { Signup } from "../auth/signup/Signup.page";
import { ModalContainer, ModalContentContainer } from "./style";




export const ModalPage = (props:any) => {
  const useModal = props.useModal
  const onSignup = ()=>{
    setModalContent(<Signup useModal={useModal}/>)
  }
  const [modalContent, setModalContent] =useState(<Login useModal={useModal} onSignup={onSignup}/>)
    
    return (
      <ModalContainer className="modal-base">
        <ModalContentContainer>
          {modalContent}
        </ModalContentContainer>
      </ModalContainer>
      )
}