import styled from "styled-components";

export const UrlContainer = styled.div`
    max-width: 300px;
    overflow-x: hidden;
    text-overflow: ellipsis;
`;

export const FocusedUrlContainer = styled.div`
    display: grid;
    max-width: 300px;
    word-break: break-all;
    align-self: center;
`;

export const BookmarkComponentContainer = styled.div`
    display: grid;
    justify-items: center;
    align-items: center;
    border: 1px solid;
    background-color: white;
    .un-focused {
        justify-self: end;
    };
    .focused {
        display: none;
    };
    &:hover{
        background-color: gray;
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
    grid-template-rows: auto auto;
    //호버 안에 넣어놓으면 따로논다
    //밖으로 빼면 걍 다 밀린다. 어떻게해야 하나?
    grid-template-columns: 9fr 1fr;
    justify-items: center;
    width: 90%;
    min-width: 330px;
    background-color: white;
`;
export const UnFocusedBookmarkComponentInner = styled.div`
    display: grid ;
    grid-template-rows: auto auto;
    justify-items: center;
    //margin-left: 20px;
    width: 90%;
    min-width: 330px;
    background-color: white;
`;

export const EditContainer = styled.div`
    display: grid ;
    grid-template-rows: 1fr 6fr;
`;

export const EditButtonContainer = styled.div`
    display: grid ;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
`;

export const BookmarkOptionButtonsContainer = styled.div`
    display: grid;
    align-items: center;
    gap: 5px;
    max-height: 200px;
    grid-template-rows: 1fr 1fr;
    padding: 3px 3px 3px 0;
`;
export const BookmarkOptionButton = styled.button`
    border: none;
    border-radius: 5px;
    width: fit-content;
    height: fit-content;
    white-space: nowrap;
`;

export const BookmarksContainer = styled.div`
    display: grid;
    gap: 5px;
    background-color: skyblue;
    height: max-content;
    padding: 5px;
    border: 1px solid;
    border-radius: 8px;
`;
