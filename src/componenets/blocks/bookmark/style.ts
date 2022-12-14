import styled from "styled-components";

export const UrlContainer = styled.div`
    max-width: 300px;
    overflow-x: hidden;
    text-overflow: ellipsis;
`;
export const BookmarkComponentContainer = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    border: 1px solid;
    background-color: white;
    &:hover{
        background-color: gray;
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
    grid-template-columns: 5fr 1fr;
    justify-items: center;
    //margin-left: 20px;
    width: 100%;
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
    gap: 5px;
    grid-template-rows: 1fr 1fr;
`;
export const BookmarkOptionButton = styled.button`
    border: none;
    border-radius: 5px;
    width: fit-content;
`;

export const BookmarksContainer = styled.div`
display: grid;
gap: 5px;
background-color: skyblue;
height: max-content;
`;
