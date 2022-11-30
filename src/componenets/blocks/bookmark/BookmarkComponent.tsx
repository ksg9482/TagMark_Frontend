import React, { useState } from "react";
import styled from "styled-components"
import { Tag } from "../../../interface/tag";
import Tags from "../tag/tags"
import BookmarkOptionButtons from "./BookmarkOptionButtons"
import { BookmarkComponentContainer, BookmarkComponentInner, UrlContainer } from "./style";
//클릭시 -> 색바뀜, 옵션창 나옴


const BookmarkComponent = (props: any) => {
    //const id = props.id
    const editSave = props.editSave
    const bookmark = props.bookmark;
    const tags = bookmark.tags;
    const url = bookmark.url;
    const [focused, setFocused] = useState(false);
    const [editOn, setEditOn] = useState(false);
    const [view, setView] = useState({ url: url, tags: tags })
    const [editInput, setEditInput] = useState({ url: url, tags: tags })
    const tagArrToStr = (tags:Tag[]) => {
        const result = [];
        for(let tag of tags) {
            result.push(tag.name);
        };
        
        return result.join(' ');
    };
    const tagStrToArr = (tagStr:string) => {
        const tagArr = tagStr.split(' ').map((tagName)=>{return {name:tagName}})
        return tagArr
    };
    const onEditInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditInput({ ...editInput, [key]: e.target.value });
      };

    const editFocus = () => {
        //다른 에디트 누르면 원상복귀
        setEditOn(true)
    };
    const onComplete = () => {
        const tagArr = tagStrToArr(editInput.tags)
        const bookmarkForm = {url:editInput.url, tags:tagArr}
        setView(bookmarkForm)
        editSave(bookmark.id, bookmarkForm)
        setEditOn(false)
        setFocused(false)
    };

    

    const BookmarkComponentContent = () => {
        return (
            <BookmarkComponentInner>
                <div className="main">
                    <UrlContainer>{view.url}</UrlContainer>
                    <Tags tags={view.tags} getTagBookmark={props.getTagBookmark} />
                </div>
                {focused ? <BookmarkOptionButtons bookmark={bookmark} onBookmarkDelete={props.onBookmarkDelete} editFocus={editFocus}/> : null}
            </BookmarkComponentInner>
        )
    };
    
    const onCancle = () => {
        setView({ url: url, tags: tags })
        setEditInput({ url: url, tags: tags })
        setEditOn(false)
        setFocused(false)
    }
    const BookmarkEditContent = () => {
        return (
            <BookmarkComponentInner>
                <input type="text" defaultValue={editInput.url} onChange={onEditInput('url')}/>
                <textarea name="" id="" cols={30} rows={10} defaultValue={tagArrToStr(editInput.tags)} onChange={onEditInput('tags')}></textarea>
                <button onClick={onCancle}>취소</button>
                <button onClick={onComplete}>완료</button>
            </BookmarkComponentInner>
        )
    }
    return (
        <BookmarkComponentContainer id={bookmark.id} onMouseOver={() => setFocused(true)} onMouseOut={() => setFocused(false)}>
            {editOn ? BookmarkEditContent() : BookmarkComponentContent()}
        </BookmarkComponentContainer>

    )
};
export default BookmarkComponent;