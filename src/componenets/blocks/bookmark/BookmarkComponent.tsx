import React, { useState } from "react";
import styled from "styled-components"
import { Tag } from "../../../interface/tag";
import { secure } from "../../../utils/secure";
import Tags from "../tag/tags"
import BookmarkOptionButtons from "./BookmarkOptionButtons"
import { BookmarkComponentContainer, BookmarkComponentInner, UrlContainer } from "./style";
//클릭시 -> 색바뀜, 옵션창 나옴


const BookmarkComponent = (props: any) => {
    const id = props.id
    const secureWrap = secure().wrapper()
    const editSave = props.editSave
    const bookmark = props.bookmark;
    const url = bookmark.url;
    const tags = bookmark.tags ? bookmark.tags : []

    const [focused, setFocused] = useState(false);
    const [editOn, setEditOn] = useState(false);
    const [view, setView] = useState({ url: url, tags: tags })
    const [editInput, setEditInput] = useState({ url: url, tags: tags })
    const tagArrToStr = (tags:Tag[]) => {
        const result = [];
        for(let tag of tags) {
            result.push(tag.tag);
        };
        
        return result.join(' ');
    };
    const tagStrToArr = (tagStr:string) => {
        const tagArr = tagStr.split(' ').map((tagName)=>{return {tag:tagName}})
        return tagArr
    };
    const onEditInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditInput({ ...editInput, [key]: secureWrap.encryptWrapper(e.target.value) });
      };

    const editFocus = () => {
        //다른 에디트 누르면 원상복귀
        setEditOn(true)
    };

    const editOut = () => {
        setEditOn(false);
        setFocused(false);
    };

    const editHandle = () => {
        const deepCopy = (obj:any) => {
            if (obj instanceof Object) {
                let result = new obj.constructor();
                Object.keys(obj).forEach(k => {
                    result[k] = deepCopy(obj[k]);
                })
                return result;
            }
            else if (obj instanceof Array) {
                let result = obj.map(element => deepCopy(element));
            }
            else return obj;
        }
        const originBookmarkdata = deepCopy(view);
        
    
        const onComplete = () => {
        
            if(!Array.isArray(editInput.tags)){
                console.log('배열아님', editInput.tags)
            }
            const tagStrDecrypted = secureWrap.decryptWrapper(editInput.tags)
            console.log(tagStrDecrypted)
            const tagArr = tagStrDecrypted.length <= 0
            ? []//editInput.tags 
            : tagStrToArr(tagStrDecrypted);
            console.log(tagArr)
            const bookmarkForm = {url:editInput.url, tags:tagArr}
            
            setView(bookmarkForm)
            editSave(bookmark.id, originBookmarkdata, bookmarkForm) //평문전송
            editOut()
        };
    
        const onCancle = () => {
            setView(originBookmarkdata)
            setEditInput(originBookmarkdata)
            editOut()
        }

        return {
            onComplete, onCancle
        }
    }
    

    
    
    const BookmarkComponentContent = () => {
        return (
            <BookmarkComponentInner>
                <div className="main">
                    <UrlContainer>{secureWrap.decryptWrapper(view.url)}</UrlContainer>
                    {view.tags.length > 0 ? <Tags tags={view.tags} getTagBookmark={props.getTagBookmark} />: <div>&nbsp;</div>}
                </div>
                {focused ? <BookmarkOptionButtons bookmark={bookmark} onBookmarkDelete={props.onBookmarkDelete} editFocus={editFocus}/> : null}
            </BookmarkComponentInner>
        )
    };
    
    
    const BookmarkEditContent = () => {
        const editInputInit = () => {
            const tags = view.tags.map((tag:any) => {
                return {id:tag.id, tag:tag.tag}
            })
            
            return {...view, tags:tags}
        }
        return (
            <BookmarkComponentInner>
                <input type="text" defaultValue={secureWrap.decryptWrapper(editInputInit().url)} onChange={onEditInput('url')}/>
                <textarea name="" id="" cols={30} rows={10} defaultValue={tagArrToStr(editInputInit().tags)} onChange={onEditInput('tags')}></textarea>
                <button onClick={editHandle().onCancle}>취소</button>
                <button onClick={editHandle().onComplete}>완료</button>
            </BookmarkComponentInner>
        )
    }
    return (
        <BookmarkComponentContainer id={`bookmark_${bookmark.id}`} onMouseOver={() => setFocused(true)} onMouseOut={() => setFocused(false)}>
            {editOn ? BookmarkEditContent() : BookmarkComponentContent()}
        </BookmarkComponentContainer>

    )
};
export default BookmarkComponent;