import { useState } from "react";
import { CreateBookmarkData } from "../../../interface/bookmark";
import { secure } from "../../../utils/secure";
import { BlockContainer, BlockContentContainer, ButtonContainer, CreateBookmarkContainer, InputContainer } from "./style";

export const CreateBookmark = (props: any) => {
  const useCreate = props.useCreate;
  const setNewBookmark = props.setNewBookmark;
  const secureWrap = secure().wrapper()
  const [createInput, setCreateInput] = useState({ url: '', tags: '' })

  const tagStringToArray = (tagString: string) => {
    
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
    useCreate.closeModal()
  };

  const onCreate = () => {
    const url = secureWrap.decryptWrapper(createInput.url);
    const tagNames = tagStringToArray(secureWrap.decryptWrapper(createInput.tags));
    const createBookmark: CreateBookmarkData = { url, tagNames }
    setNewBookmark(createBookmark)
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
  const useCreate = props.useCreate

  return (
    <BlockContainer className="modal-base">
      <BlockContentContainer>
        <CreateBookmark useCreate={useCreate} setNewBookmark={props.setNewBookmark} />
      </BlockContentContainer>
    </BlockContainer>
  )
}