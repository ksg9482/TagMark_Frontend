import { useState } from "react";
import styled from "styled-components";
import { Login } from "../auth/login/login.page";
import { Signup } from "../auth/signup/signup.page";

const ModalContainer = styled.div`
  position: absolute;
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #81818194;
  width: 100vw;
  height: 100vh;
`;

//모달 내용
const ModalContentContainer = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #ffffff;
  width: 600px;
  height: 800px;
`;


export const BookmarkModalPage = (props:any) => {
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