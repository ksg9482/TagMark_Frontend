import { useState } from "react";
import styled from "styled-components";
import { CreateBookmarkData } from "../../../interface/bookmark";
import { UseModal } from "../../../interface/header";
import { Login } from "../auth/login/Login.page";
import { Signup } from "../auth/signup/Signup.page";

const ModalContainer = styled.div`
  //position: absolute;
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #81818194;
  width: 100%;
  height: 10vh;
`;

//모달 내용
const ModalContentContainer = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #ffffff;
  width: auto;
  height: auto;
`;
export const EditBookmark = (props: any) => {
  const useModal = props.useModal;
  return (
    <div></div>
  )
}
const CreateBookmarkContainer = styled.div`
   display: grid;
   gap: 5px;
`;
const InputContainer = styled.div`
   display: grid;
`;
const ButtonContainer = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
`;


export const CreateBookmark = (props: any) => {
  const useModal: UseModal = props.useModal;
  const setNewBookmark = props.setNewBookmark;

  const [createInput, setCreateInput] = useState({ url: '', tags: '' })
  
  const tagStringToArray = (tagString: string) => {
    const result = tagString.split(' ');
    return result
  };

  const onCreateInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateInput({ ...createInput, [key]: e.target.value });
  };
  
  const onCancle = () => {
    useModal.closeModal()
  };

  const onCreate = () => {
    const url = createInput.url;
    const tags = tagStringToArray(createInput.tags);
    const createBookmark:CreateBookmarkData = {url, tags}
    setNewBookmark(createBookmark)
    useModal.closeModal()
  }
  return (
    <CreateBookmarkContainer>
      <InputContainer>
        <input type="text" name="url" id="url_input" onChange={onCreateInput('url')} placeholder={'url'} />
        <input type="text" name="tags" id="tags_input" onChange={onCreateInput('tags')} placeholder={'태그들'} />
        {/* 여기에 자동완성 창? */}
      </InputContainer>
      <ButtonContainer>
        <button onClick={onCancle}>취소</button>
        <button onClick={onCreate}>생성</button>
      </ButtonContainer>
    </CreateBookmarkContainer>
  )
}
export const BookmarkModalPage = (props: any) => {
  const useModal = props.useModal

  const [modalContent, setModalContent] = useState(<CreateBookmark useModal={useModal} setNewBookmark={props.setNewBookmark} />)

  return (
    <ModalContainer className="modal-base">
      <ModalContentContainer>
        {modalContent}
      </ModalContentContainer>
    </ModalContainer>
  )
}