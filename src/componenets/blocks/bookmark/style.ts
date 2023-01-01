import styled from "styled-components";

export const UrlContainer = styled.a`
    max-width: 280px;
    overflow-x: hidden;
    text-overflow: ellipsis;
`;

export const FocusedUrlContainer = styled.a`
    display: grid;
    max-width: 280px;
    word-break: break-all;
    align-self: center;
    text-decoration:none;
    color: black;
`;

export const BookmarkComponentContainer = styled.div`
    display: grid;
    justify-items: center;
    align-items: center;
    border: 1px solid;
    background-color: white;
    
    .focused {
        display: none;
    };
    &:hover{
        background-color: #f5eedd;
        .un-focused {
            display: none;
        };
        .focused {
            display: grid;
        };
    };
`;

export const BookmarkComponentEditInner = styled.div`
    display: grid ;
    grid-template-rows: auto auto;
    justify-items: center;
    width: 100%;
    min-width: 330px;
    background-color: white;
`;
export const BookmarkComponentInner = styled.div`
    display: grid ;
    justify-items: center;
    width: 90%;
    min-width: 330px;
    background-color: white;
`;
export const UnFocusedBookmarkComponentInner = styled.div`
    display: grid ;
    grid-template-rows: auto auto;
    justify-items: center;
    width: 90%;
    min-width: 330px;
    background-color: white;
`;

export const EditContainer = styled.div`
    display: grid ;
    gap: 5px;
    margin: 5px 0 5px 0;
    grid-template-rows: 3fr 4fr;
`;

export const EditButtonContainer = styled.div`
    display: grid ;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 5px;
`;

export const BookmarkOptionButtonsContainer = styled.div`
    display: grid;
    align-items: center;
    gap: 5px;
    max-height: 200px;
    grid-template-rows: 1fr 1fr;
    margin: 3px 3px 3px 0;
    justify-self: right;
`;
export const BookmarkOptionButton = styled.button`
    border: none;
    border-radius: 5px;
    width: 42px;
    height: fit-content;
    white-space: nowrap;
`;

export const BookmarksContainer = styled.div`
    display: grid;
    gap: 5px;
    background-color: #97b5e1;
    height: max-content;
    padding: 5px;
    border: 1px solid;
    border-radius: 8px;
`;

export const BlockContainer = styled.div`
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

export const BlockContentContainer = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background-color: #ffffff;
  width: auto;
  height: auto;
`;

export const CreateBookmarkContainer = styled.div`
   display: grid;
   gap: 5px;
`;

export const InputContainer = styled.div`
   display: grid;
   gap: 5px;
`;

export const ButtonContainer = styled.div`
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 5px;
`;

export const BookmarkContent = styled.div`
    display: grid;
    justify-items: center;
    margin-left: 42px;
`;

export const FocusedBookmarkComponentInner = styled.div`
    display: grid;
    grid-template-columns: auto min-content;
    width: 100%;
`;