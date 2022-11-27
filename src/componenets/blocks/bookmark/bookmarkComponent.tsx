import React, { useState } from "react";
import styled from "styled-components"
import Tags from "../tag/tags"
import BookmarkButtonBlock from "./bookmarkOptionButton"
//클릭시 -> 색바뀜, 옵션창 나옴


const BookmarkComponent = (props: any) => {
    const [focused, setFocused] = useState(false);
    const bookmark = props.bookmark;
    const tags = bookmark.tags;
    const url = bookmark.url;

    return (
        <BookmarkComponentContainer onMouseOver={() => setFocused(true)} onMouseOut={() => setFocused(false)}>
            <BookmarkComponentInner>
                <div className="main">
                    <UrlCintainer>{url}</UrlCintainer>
                    <Tags tags={tags}/>
                </div>
                {focused ? <BookmarkButtonBlock/> : null}
            </BookmarkComponentInner>
        </BookmarkComponentContainer>

    )
}
const UrlCintainer = styled.div`
    max-width: 300px;
    overflow-x: hidden;
    text-overflow: ellipsis;
`;
const BookmarkComponentContainer = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    border: 1px solid;
    background-color: white;
    &:hover{
        background-color: gray;
    }
`;
//이름 어떻게?
const BookmarkComponentInner = styled.div`
    display: grid ;
    grid-template-columns: 5fr 1fr;
    justify-items: center;
    width: 100%;
    min-width: 330px;
    background-color: white;
`;




export default React.memo(BookmarkComponent)