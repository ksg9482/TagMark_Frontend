import { useCallback, useState } from "react";
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

export const UseModal = () => {
  const [isShowModal, setIsShowModal] = useState(false);

  const openModal = useCallback(() => {
    setIsShowModal(true);
  }, [setIsShowModal]);

  const closeModal = useCallback(() => {
    setIsShowModal(false);
  }, [setIsShowModal]);

  const toggleModal = useCallback(() => {
    setIsShowModal(prev => !prev);
  }, [setIsShowModal]);

  return { isShowModal, openModal, closeModal, toggleModal };
}

const modalContentMap = {
    login: <Login/>,
    signup:<Signup />
}
export const ModalPage = () => {
    const loginModal = ()=>{
        return (
        <ModalContainer className="modal-base">
          <ModalContentContainer>
            {modalContentMap.login}
          </ModalContentContainer>
        </ModalContainer>
        )
    };
    const signupModal = ()=>{
        return (
        <ModalContainer className="modal-base">
          <ModalContentContainer>
            {modalContentMap.signup}
          </ModalContentContainer>
        </ModalContainer>
        )
    };
    return {loginModal, signupModal}
}