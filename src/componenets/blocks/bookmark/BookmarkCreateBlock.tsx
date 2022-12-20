import { useState } from "react";
import styled from "styled-components";
import { CreateBookmarkData } from "../../../interface/bookmark";
import { UseModal } from "../../../interface/header";
import { secure } from "../../../utils/secure";
import { Login } from "../../pages/auth/login/Login.page";
import { Signup } from "../../pages/auth/signup/Signup.page";

const BlockContainer = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #ffffff;
  border: 1px solid;
  border-radius: 5px;
  margin: 15px 0 10px 0;
  max-width: 100%;
  height: 10vh;
`;


const BlockContentContainer = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #ffffff;
  width: auto;
  height: auto;
`;

const CreateBookmarkContainer = styled.div`
   display: grid;
   gap: 5px;
`;
const InputContainer = styled.div`
   display: grid;
   gap: 5px;
`;
const ButtonContainer = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 5px;
`;


export const CreateBookmark = (props: any) => {
  const useModal: UseModal = props.useModal;
  const setNewBookmark = props.setNewBookmark;
  const secureWrap = secure().wrapper()
  const [createInput, setCreateInput] = useState({ url: '', tags: '' })
  
  const tagStringToArray = (tagString: string) => {
    const result = tagString.split(' ');
    return result
  };

  const onCreateInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 0) {
      setCreateInput({ ...createInput, [key]: '' });
      return ;
  }
    setCreateInput({ ...createInput, [key]:  secureWrap.encryptWrapper(e.target.value) });
  };
  
  const onCancle = () => {
    useModal.closeModal()
  };

  const onCreate = () => {
    //console.log(createInput)
    const url = secureWrap.decryptWrapper(createInput.url);
    const tags = tagStringToArray(secureWrap.decryptWrapper(createInput.tags));
    const createBookmark:CreateBookmarkData = {url, tags}
    //console.log(createBookmark)
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
export const BookmarkCreateBlock = (props: any) => {
  const useModal = props.useModal

  const [modalContent, setModalContent] = useState(<CreateBookmark useModal={useModal} setNewBookmark={props.setNewBookmark} />)

  return (
    <BlockContainer className="modal-base">
      <BlockContentContainer>
        {modalContent}
      </BlockContentContainer>
    </BlockContainer>
  )
}