import React, { useState } from "react";
import { Tag } from "../../../interface/tag";
import { secure } from "../../../utils/secure";
import Tags from "../tag/tags"
import BookmarkOptionButtons from "./BookmarkOptionButtons"
import { BookmarkComponentContainer, BookmarkComponentEditInner, BookmarkComponentInner, BookmarkContent, EditButtonContainer, EditContainer, FocusedBookmarkComponentInner, FocusedUrlContainer, UnFocusedBookmarkComponentInner, UrlContainer } from "./style";
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
    const tagArrToStr = (tags: Tag[]) => {
        const result = [];
        for (let tag of tags) {
            result.push(tag.tag);
        };

        return result.join('\n');
    };
    const tagStrToArr = (tagStr: string) => {
        if (Array.isArray(tagStr)) {
            return tagStr
        }
        const tagArr = tagStr.split('\n').map((tagName) => { return { tag: tagName } })
        return tagArr
    };
    const onEditInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
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

            if (!Array.isArray(editInput.tags)) {
                console.log('배열아님', editInput.tags)
            }
            const tagStrDecrypted = secureWrap.decryptWrapper(editInput.tags)
            const tagArr = tagStrDecrypted.length <= 0
                ? []//editInput.tags 
                : tagStrToArr(tagStrDecrypted);
            const decryptedUrl = secureWrap.decryptWrapper(editInput.url)
            const bookmarkForm = { url: decryptedUrl, tags: tagArr }

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
        const a = secureWrap.decryptWrapper(view.url)
        const tagLength = view.tags?.length

        // const UnFocusedBookmark = () => {
        //     return (
        //         <UnFocusedBookmarkComponentInner id="bookmark-component-inner">
        //             <UrlContainer>{a}</UrlContainer>
        //             {tagLength >= 0 ? <Tags tags={view.tags} getTagBookmark={props.getTagBookmark} /> : <div>&nbsp;</div>}
        //         </UnFocusedBookmarkComponentInner>
        //     )
        // }
        // //url창에 나온 주소와 %문법쓴 거랑 고려해야됨. 보이는 건 원래대로. 클릭은 %문법으로 가게 
        // const FocusedBookmark = () => {
        //     return (
        //         <BookmarkComponentInner id="bookmark-component-inner">
        //             <div>
        //                 <FocusedUrlContainer>{a}</FocusedUrlContainer>
        //                 {tagLength >= 0 ? <Tags tags={view.tags} getTagBookmark={props.getTagBookmark} /> : <div>&nbsp;</div>}
        //             </div>
        //             <BookmarkOptionButtons bookmark={bookmark} onBookmarkDelete={props.onBookmarkDelete} editFocus={editFocus} />
        //     </BookmarkComponentInner>
        //         )
        // }

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
        <BookmarkComponentContainer id={`bookmark_${bookmark.id}`} onMouseOver={() => setFocused(true)} onMouseOut={() => setFocused(false)}>
            {editOn ? BookmarkEditContent() : BookmarkComponentContent()}
        </BookmarkComponentContainer>

    )
};

export default BookmarkComponent;