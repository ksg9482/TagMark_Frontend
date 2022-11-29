import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { dumyBookmark } from "../../../dumy/dumy-bookmarks";
import { dumyTags } from "../../../dumy/dumy-tags";
import { Bookmark } from "../../../interface/bookmark";
import { Tag } from "../../../interface/tag";
import Bookmarks from "../../blocks/bookmark/bookmarks";
import SideBar from "../../blocks/sidebar/sidebar";
import { BookmarkModalPage } from "../modal/bookmarkModal.page";

export interface CreateBookmarkData {
    id?:any;
    url: string;
    tags: string[];
}
const TagComponent = (props: any) => {
    const tag = props.tag;
    return (
        <button>{tag.name}</button>
    )
}
//이거 북마크 태그 컴포넌트와 얼만큼 겹치는지?
const Tags = (props: any) => {
    const tags = props.tags
    return (
        <div>{tags.map((tag: Bookmark) => (
            <TagComponent tag={tag} key={tag.id} />
        ))}</div>
    )
}
const EditTags = (props: any) => {
    return (
        <div><Tags tags={props.tags} /></div>
    )
}

const BookMarkEdit = () => {
    return (<div>
        <textarea defaultValue={'북마크가 여기 써져있어야 함'}></textarea>
        <div>
            <EditTags tags={dumyTags} />
        </div>
    </div>)
}

const BookmarkContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 20% auto;
`;

const BookmarkManageContainer = styled.div`
  display: grid;
  grid-template-rows: 50px auto;
`;

const BookmarkManagebuttonContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 25% 25%;
`;

export const BookMark = (props: any) => {
    const UseModal = () => {
        const [isShowModal, setIsShowModal] = useState(false);

        const openModal = useCallback(() => {
            setIsShowModal(true);
        }, [setIsShowModal]);

        const closeModal = useCallback(() => {
            setIsShowModal(false);
        }, [setIsShowModal]);

        const toggleModal = useCallback(() => {
            setIsShowModal(prev => !prev);
        }, [setIsShowModal]);

        return { isShowModal, openModal, closeModal, toggleModal };
    }
    const useModal = UseModal()
    const isLogin = false//props.isLogin 
    const bookmarkInitData: Bookmark = {
        id: 0,
        url: '',
        tags: [{
            id: 0,
            name: ''
        }]
    }
    const [originBookmarks, setOriginBookmarks] = useState([bookmarkInitData]);
    const [bookmarkView, setBookmarkView] = useState([bookmarkInitData]);
    
    const getTagBookmark = (targetTags: string[]) => {
        //태그 눌러가면서 원하는거 좁혀가려면?
        const localBookmarks: Bookmark[] = JSON.parse(localStorage.getItem('local-bookmark-storage')!)
        const bookmarkFilter = localBookmarks.filter((bookmark) => {
            const tagFilter = bookmark.tags.filter((tag) => {
                return targetTags.includes(tag.name)
            })
            if (1 <= tagFilter.length) return tagFilter
        })
        return setBookmarkView(bookmarkFilter)
    };

    const bookmarkAdapter = (bookmark: any): Bookmark[] => {
        let bookmarkResult: Bookmark[]
        if (typeof bookmark === 'string') {
            const jsonParsedData = JSON.parse(bookmark);
            //json 형식이 아닐경우
            if (!jsonParsedData) {
                bookmarkResult = [bookmarkInitData]
            }
            bookmarkResult = JSON.parse(bookmark)
        }
        else {
            bookmarkResult = bookmark
        }
        return bookmarkResult
    };
    const getBookmark = async (isLogin: boolean) => {
        //로컬 스토리지에서
        const localBookmarks = localStorage.getItem('local-bookmark-storage')!
        const bookmark = bookmarkAdapter(localBookmarks);
        if (!isLogin) {
            setOriginBookmarks(bookmark)
            return setBookmarkView(bookmark)
        }
        else {
            //서버 연결
            return setBookmarkView(bookmark)
        }
    };

    const bookmarkRefresh = () => {
        setBookmarkView(originBookmarks)
    };
    
    const bookmarkCreate = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        useModal.openModal();
    };
    const saveNewBookmark = (newBookmarkData:Bookmark | Bookmark[]) => {
        if(!isLogin){
            localStorage.removeItem('local-bookmark-storage')
            localStorage.setItem('local-bookmark-storage', JSON.stringify(newBookmarkData))
        }
        //서버 저장
    };
    const bookmarkSequence = (newBookmarks:Bookmark[]) => {
        setBookmarkView(newBookmarks)
        setOriginBookmarks(newBookmarks)
        saveNewBookmark(newBookmarks)
    }
    const setNewBookmark = (createBookmarkData:CreateBookmarkData) => {
        const lastId = originBookmarks[0].id
        const id = lastId + 1;
        const url = createBookmarkData.url
        const tags = createBookmarkData.tags.map((tag, i)=>{
            return {id:'tempTag'+i, name:tag}
        })

        //태그 중복 방지는?
        const newBookmarkArr:Bookmark[] = [{id,url,tags}]
        newBookmarkArr.push(...bookmarkView)
        bookmarkSequence(newBookmarkArr)
        //처리 끝난 데이터를 받아 로컬 혹은 DB저장. view, origin 갱신
    };

    //어차피 정렬되어있다면 이진검색으로 인덱스 찾는게 빠르지 않을까?
    const getMachedIndex = (targetBookmarkId:any) => {
        let isMachedIndex:any;
        const targetId = Number(targetBookmarkId)
        const length = originBookmarks.length;

        for(let i = 0; i < length; i++) {
            if(originBookmarks[i].id === targetId) {
                isMachedIndex = i
                break;
            }
            //isMachedIndex = undefined
        }
        return isMachedIndex
    }
    const onBookmarkDelete = (targetBookmarkId:any) => {
        const length = originBookmarks.length;
        const isMachedIndex = getMachedIndex(targetBookmarkId)
        const deletedBookmark = [...originBookmarks.slice(0,isMachedIndex), ...originBookmarks.slice(isMachedIndex + 1, length)]
        bookmarkSequence(deletedBookmark)
    }

    
    useEffect(() => {
        //이거 리덕스로 옮겨서 관리? 아니면 최상단으로 올려서 프롭스로 내릴까?
        if (!isLogin && !localStorage.getItem('local-bookmark-storage')) {
            localStorage.setItem('local-bookmark-storage', JSON.stringify(dumyBookmark))
        }
        getBookmark(isLogin)
    }, [])
    return (
        <BookmarkContainer>
            <SideBar getTagBookmark={getTagBookmark} />
            <div></div>
            <BookmarkManageContainer>
                <BookmarkManagebuttonContainer>
                    <div></div>
                    <button onClick={bookmarkRefresh}>북마크 전체보기</button>
                    <button onClick={bookmarkCreate}>북마크 생성</button>
                </BookmarkManagebuttonContainer>
            {useModal.isShowModal ? <BookmarkModalPage useModal={useModal} setNewBookmark={setNewBookmark}/>: null}
                <Bookmarks bookmarkView={bookmarkView} getTagBookmark={getTagBookmark} onBookmarkDelete={onBookmarkDelete}/>
                <PageMoveBlock count={bookmarkView.length} />
            </BookmarkManageContainer>
        </BookmarkContainer>
    )
};

export const PageMoveBlock = (props: any) => {
    const bookmarkMax = 20;
    const count = props.count;
    const buttonCount = Math.ceil(count / bookmarkMax);

    return (
        <PageButtonsContainer>
            <div>맨앞</div>
            <div>이전</div>
            <Numbers buttonCount={buttonCount} />
            <div>이후</div>
            <div>맨뒤</div>
        </PageButtonsContainer>
    )
};

const PageNumComponent = (props: any) => {
    const arrNum = props.arrNum
    return (
        <div>
            {arrNum}
        </div>
    )
}
const PageNumsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
`;
const Numbers = (props: any) => {
    const buttonCount = props.buttonCount
    const arr = new Array(buttonCount).fill(0).map((data, i) => { return i + 1 })

    return (
        <PageNumsContainer>{
            arr.map((arrNum, i: number) => {
                return (
                    <PageNumComponent arrNum={arrNum} key={i} />
                )
            })
        }</PageNumsContainer>
    )
}




const PageButtonsContainer = styled.div`
    display: grid;
    grid-template-columns: 15% 15% 40% 15% 15%;
`;
//export default BookMark