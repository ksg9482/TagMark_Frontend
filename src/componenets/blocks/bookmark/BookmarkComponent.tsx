import React, { useState } from "react";
import { Tag } from "../../../interface/tag";
import { secure } from "../../../utils/secure";
import Tags from "../tag/tags"
import BookmarkOptionButtons from "./BookmarkOptionButtons"
import { BookmarkComponentContainer, BookmarkComponentEditInner, BookmarkComponentInner, BookmarkContent, EditButtonContainer, EditContainer, FocusedBookmarkComponentInner, FocusedUrlContainer, UnFocusedBookmarkComponentInner, UrlContainer } from "./style";

const BookmarkComponent = (props: any) => {
    const secureWrap = secure().wrapper()
    const editSave = props.editSave
    const bookmark = props.bookmark;
    const url = bookmark.url;
    const tags = bookmark.tags ? bookmark.tags : []

    const [editOn, setEditOn] = useState(false);
    const [view, setView] = useState({ url: url, tags: tags })
    const [editInput, setEditInput] = useState({ url: url, tags: tags })
    const tagArrToStr = (tags: Tag[]) => {
        const result = [];
        for (let tag of tags) {
            result.push(tag.tag);
        };

        return result.join(', ');
    };
    const tagStrToArr = (tagStr: string) => {
        /**
         * (^\\s+): 문자열의 시작부분에 있는 공백문자
         * 
         * |: 또는
         * 
         * (\\s+(?=\\s)): 문자열 사이에 삽입된 스페이스 바 한 번을 제외한 모든 연속된 공백문자. 전방탐색 ((?=\\s)) 사용
         * 
         * (\\s+$): 문자열의 끝부분에 있는 공백문자
         */
        const emptyCheckReg = /(^\s+|\s+(?=\s)|\s+$)/g;
        
        if (Array.isArray(tagStr)) {
            return tagStr
        }
        const tagArr = tagStr.split(',')
        .map((tagName) => { 
            tagName = tagName.replace(emptyCheckReg, '')
            return { tag: tagName } 
        })
        .filter((tag)=>{
            return tag.tag.length > 0
        })
        return tagArr
    };
    const onEditInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditInput({ ...editInput, [key]: secureWrap.encryptWrapper(e.target.value) });
    };

    const editFocus = () => {
        setEditOn(true)
    };

    const editOut = () => {
        setEditOn(false);
    };

    const editHandle = () => {
        const deepCopy = (obj: any) => {
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
            const tagStrDecrypted = secureWrap.decryptWrapper(editInput.tags)
            const tagArr = tagStrDecrypted.length <= 0
                ? []
                : tagStrToArr(tagStrDecrypted);
            const decryptedUrl = secureWrap.decryptWrapper(editInput.url)
            const bookmarkForm = { url: decryptedUrl, tags: tagArr }

            setView(bookmarkForm)
            editSave(bookmark.id, originBookmarkdata, bookmarkForm) 
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
        const a = secureWrap.decryptWrapper(view.url)
        const tagLength = view.tags?.length


        return (
            <BookmarkComponentInner id="bookmark-component-inner">
                <UnFocusedBookmarkComponentInner id="un-focused" className="un-focused">
                    <UrlContainer>{decodeURI(a)}</UrlContainer>
                    {tagLength >= 0 ? <Tags tags={view.tags} getTagBookmark={props.getTagBookmark} /> : <div>&nbsp;</div>}
                </UnFocusedBookmarkComponentInner>
                <FocusedBookmarkComponentInner id="focused" className="focused">
                    <BookmarkContent>
                        <FocusedUrlContainer href={a} target='_blank'>{decodeURI(a)}</FocusedUrlContainer>
                        {tagLength >= 0 ? <Tags tags={view.tags} getTagBookmark={props.getTagBookmark} /> : <div>&nbsp;</div>}
                    </BookmarkContent>
                    <BookmarkOptionButtons bookmark={bookmark} onBookmarkDelete={props.onBookmarkDelete} editFocus={editFocus} />
                </FocusedBookmarkComponentInner>
            </BookmarkComponentInner>
        )
    };

    const BookmarkEditContent = () => {
        const editInputInit = () => {
            const tags = view.tags.map((tag: any) => {
                return { id: tag.id, tag: tag.tag }
            })

            return { ...view, tags: tags }
        }
        return (
            <BookmarkComponentEditInner>
                <EditContainer>
                    <textarea defaultValue={secureWrap.decryptWrapper(editInputInit().url)} onChange={onEditInput('url')} />
                    <textarea name="" id="" cols={40} defaultValue={tagArrToStr(editInputInit().tags)} onChange={onEditInput('tags')} />
                </EditContainer>
                <EditButtonContainer>
                    <button onClick={editHandle().onCancle}>취소</button>
                    <button onClick={editHandle().onComplete}>완료</button>
                </EditButtonContainer>
            </BookmarkComponentEditInner>
        )
    }
    return (
        <BookmarkComponentContainer id={`bookmark_${bookmark.id}`}>
            {editOn ? BookmarkEditContent() : BookmarkComponentContent()}
        </BookmarkComponentContainer>

    )
};

export default BookmarkComponent;