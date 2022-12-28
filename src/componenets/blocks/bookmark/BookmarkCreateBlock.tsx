import { useState } from "react";
import { CreateBookmarkData } from "../../../interface/bookmark";
import { UseModal } from "../../../interface/header";
import { secure } from "../../../utils/secure";
import { Login } from "../../pages/auth/login/Login.page";
import { Signup } from "../../pages/auth/signup/Signup.page";
import { BlockContainer, BlockContentContainer, ButtonContainer, CreateBookmarkContainer, InputContainer } from "./style";




export const CreateBookmark = (props: any) => {
  const useModal: UseModal = props.useModal;
  const setNewBookmark = props.setNewBookmark;
  const secureWrap = secure().wrapper()
  const [createInput, setCreateInput] = useState({ url: '', tags: '' })

  const tagStringToArray = (tagString: string) => {
    //정규표현식으로 , 뒤에 공백 많거나 있는거 잡아내기
    //다른 형식이면 안내창으로 행동방침 안내할 것.
    tagString = tagString.replaceAll(', ', ',')
    const result = tagString.split(',');
    return result
  };

  const onCreateInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 0) {
      setCreateInput({ ...createInput, [key]: '' });
      return;
    }
    setCreateInput({ ...createInput, [key]: secureWrap.encryptWrapper(e.target.value) });
  };

  const onCancle = () => {
    useModal.closeModal()
  };

  const onCreate = () => {
    const url = secureWrap.decryptWrapper(createInput.url);
    const tagNames = tagStringToArray(secureWrap.decryptWrapper(createInput.tags));
    const createBookmark: CreateBookmarkData = { url, tagNames }
    setNewBookmark(createBookmark)
    useModal.closeModal()
  }
  return (
    <CreateBookmarkContainer>
      <InputContainer>
        <input type="text" name="url" id="url_input" onChange={onCreateInput('url')} placeholder={'https://...'} />
        <input type="text" name="tags" id="tags_input" onChange={onCreateInput('tags')} placeholder={'Tag1, Tag2...'} />
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

  return (
    <BlockContainer className="modal-base">
      <BlockContentContainer>
        <CreateBookmark useModal={useModal} setNewBookmark={props.setNewBookmark} />
      </BlockContentContainer>
    </BlockContainer>
  )
}