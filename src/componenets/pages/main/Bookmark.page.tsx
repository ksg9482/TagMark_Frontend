import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { dumyBookmark } from "../../../dumy/dumy-bookmarks";
import { dumyTags } from "../../../dumy/dumy-tags";
import { Bookmark, CreateBookmarkData } from "../../../interface/bookmark";
import { Tag } from "../../../interface/tag";
import { secure } from "../../../utils/secure"
import Bookmarks from "../../blocks/bookmark/Bookmarks";
import { PageMove } from "../../blocks/bookmark/pageMove/PageMove";
import SideBar from "../../blocks/sidebar/Sidebar";
import { BookmarkModalPage } from "../modal/BookmarkModalPage";
import { BookmarkContainer, BookmarkManagebuttonContainer, BookmarkManageContainer } from "./styles";


export enum FindType {
    origin = 'origin',
    view = 'view'
}


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
    const [isLogin, setIsLogin] = useState(false)

    const bookmarkInitData: Bookmark = {
        id: 'init',
        url: '',
        tags: [{
            id: 'init',
            name: ''
        }]
    }
    //전부 갖고 있음. 유지용
    const [originBookmarks, setOriginBookmarks] = useState([bookmarkInitData]);
    //페이지 보이기용
    const [bookmarkView, setBookmarkView] = useState([bookmarkInitData]);
    //로컬 페이지네이션
    const [localBookmarkPage, setLocalBookmarkPage] = useState([[bookmarkInitData]]);
    //로컬 스토리지에 숫자 저장해서 쓰는걸로? 
    const [currentPageNum, setCurrentPageNum] = useState(1)
    const getTagBookmark = (targetTags: string[], findType:FindType) => {
        //태그 눌러가면서 원하는거 좁혀가려면?
        const bookmarkArr: Bookmark[] = findType === 'origin' ? originBookmarks : bookmarkView ;
        const bookmarkFilter = bookmarkArr.filter((bookmark) => {
            const tagFilter = bookmark.tags.filter((tag) => {
                return targetTags.includes(tag.name)
            })
            if (1 <= tagFilter.length) return tagFilter
        })
        //페이지네이션으로 안나옴
        //console.log(bookmarkFilter.length, bookmarkFilter)
        setLocalBookmarkPage(setLocalPagenation(bookmarkFilter, 20))
            // //해당하는페이지 보여줌
            createBookmarkView(setLocalPagenation(bookmarkFilter, 20),currentPageNum -1)
        //return setBookmarkView(bookmarkFilter)
    };

    const bookmarkAdapter = (bookmark: any): Bookmark[] => {
        let bookmarkResult: Bookmark[]
        if (typeof bookmark === 'string') {
            const jsonParsedData = JSON.parse(bookmark);
            //json 형식이 아닐경우
            if (!jsonParsedData) {
                bookmarkResult = [bookmarkInitData];
            };
            bookmarkResult = JSON.parse(bookmark);
        }
        else {
            bookmarkResult = bookmark;
        };
        return bookmarkResult;
    };
    const setLocalPagenation = (bookmark:Bookmark[], pageCount:number) => {
        const copy = deepCopy(bookmark)
        const length = bookmark.length;
        const cnt = Math.floor(length/pageCount) + (Math.floor(length % pageCount) > 0 ? 1: 0);
        const result:Bookmark[][] = [];
        for (let i = 0; i < cnt; i++) {
            result.push(copy.splice(0, pageCount))
        }
        return result
    }
    const createBookmarkView = (pagenationBookmark:Bookmark[][], targetPage:number) => {
        setBookmarkView(pagenationBookmark[targetPage])
    }
    const getBookmark = async (isLogin: boolean) => {
        //로컬 스토리지에서
        const localBookmarks = secure().local().getItem('local-bookmark-storage')!
        const bookmark = bookmarkAdapter(localBookmarks);
        if (!isLogin) {
            //원본저장
            setOriginBookmarks(bookmark);
            //페이지네이션 별로 구분
            setLocalBookmarkPage(setLocalPagenation(bookmark, 20))
            // //해당하는페이지 보여줌
            createBookmarkView(setLocalPagenation(bookmark, 20),currentPageNum -1)
            // return setBookmarkView(bookmark);
        }
        else {
            //서버 연결. 페이지네이션으로.
            return setBookmarkView(bookmark)
        }
    };

    const bookmarkRefresh = () => {
        setBookmarkView(originBookmarks)
    };

    const bookmarkCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        useModal.openModal();
    };
    const saveNewBookmarkStorage = (newBookmarkData: Bookmark | Bookmark[]) => {
        if (!isLogin) {
            secure().local().removeItem('local-bookmark-storage')
            secure().local().setItem('local-bookmark-storage', JSON.stringify(newBookmarkData))
        }
        //서버 저장
    };
    //다 뒤로 한칸씩 미느니 아예 다시 만드는게 편할까?
    //생성하면 어차피 1로 가니까 1번의 맨뒤 하나 삭제하고 앞에 삽입. 
    const updateBookmarkView = (bookmarks:Bookmark[]) => {
        setBookmarkView(bookmarks)
    }
    const updateOriginBookmark = (bookmarks:Bookmark[]) => {
        setOriginBookmarks(bookmarks)
    }
    const bookmarkSequence = (newBookmarks: Bookmark[]) => {
        updateOriginBookmark(newBookmarks)
        saveNewBookmarkStorage(newBookmarks)
        updateBookmarkView(newBookmarks)
        //currentPageRefresh(1)
    }
    const setNewBookmark = (createBookmarkData: CreateBookmarkData) => {
        console.log(originBookmarks)
        const lastId = originBookmarks[0].id
        const id = lastId + 1;
        const url = createBookmarkData.url
        const tags = createBookmarkData.tags.map((tag, i) => {
            return { id: 'tempTag' + i, name: tag }
        })

        //태그 중복 방지는?
        const newBookmarkArr: Bookmark[] = [{ id, url, tags }]
        //newBookmarkArr.push(...bookmarkView)
        newBookmarkArr.push(...originBookmarks)
        bookmarkSequence(newBookmarkArr)
        //처리 끝난 데이터를 받아 로컬 혹은 DB저장. view, origin 갱신
    };

    //어차피 정렬되어있다면 이진검색으로 인덱스 찾는게 빠르지 않을까?
    const getMachedIndex = (targetBookmarkId: any) => {
        let isMachedIndex: any;
        const targetId = Number(targetBookmarkId)
        const length = originBookmarks.length;

        for (let i = 0; i < length; i++) {
            if (originBookmarks[i].id === targetId) {
                isMachedIndex = i
                break;
            }
            //isMachedIndex = undefined
        }
        return isMachedIndex
    }
    const onBookmarkDelete = (targetBookmarkId: any) => {
        const length = originBookmarks.length;
        const isMachedIndex = getMachedIndex(targetBookmarkId)
        const deletedBookmark = [...originBookmarks.slice(0, isMachedIndex), ...originBookmarks.slice(isMachedIndex + 1, length)]
        bookmarkSequence(deletedBookmark)
    }

    //동작이 생성과 비슷한데 재활용 방법은? 더 고도화하면 분리될 수 있으니 따로하는게 좋을까?
    const editSave = (targetBookmarkId:any, editContent:any) => {
        const url = editContent.url
        const tags = editContent.tags.map((tag:any, i:number) => {
            return { id: 'tempTag' + i, name: tag.name }
        })
        const length = originBookmarks.length;
        const isMachedIndex = getMachedIndex(targetBookmarkId)
        const editedBookmark = [...originBookmarks.slice(0, isMachedIndex),{id:targetBookmarkId, url:url, tags:tags}, ...originBookmarks.slice(isMachedIndex + 1, length)]
        bookmarkSequence(editedBookmark);
       
        //login? 서버 저장

        //no login? 로컬 저장.
    }

    const pagenationNum = (num:number) => {
        console.log('pagenationNum-', num)
        setCurrentPageNum(num)
        currentPageRefresh(num)
    } 
    useEffect(() => {
        setIsLogin(props.isLogin)
    }, [])

    useEffect(() => {
        //이거 리덕스로 옮겨서 관리? 아니면 최상단으로 올려서 프롭스로 내릴까?
        if (!isLogin && !secure().local().getItem('local-bookmark-storage')) {
            secure().local().setItem('local-bookmark-storage', JSON.stringify(dumyBookmark))
        }
        getBookmark(isLogin)
    }, [])
    //세션스토리지 관련을 함수로 묶자
    const currentPageRefresh = (currentPage:number) => {
     
        window.sessionStorage.removeItem('current-page')
        window.sessionStorage.setItem('current-page', String(currentPage))
    };
    
    useEffect(()=>{
        const isPage =  Number(window.sessionStorage.getItem('current-page'));
        if(isPage) {
            setCurrentPageNum(isPage)
        }
        else {
            window.sessionStorage.setItem('current-page', String(currentPageNum));
        }
    },[])

    useEffect(()=>{
        createBookmarkView(setLocalPagenation(originBookmarks, 20),currentPageNum -1)
    },[originBookmarks, currentPageNum])
//여기서 사이드바로 데이터를 내려줘야 한다.
    return (
        <BookmarkContainer>
            <SideBar getTagBookmark={getTagBookmark} originBookmarks={originBookmarks}/>
            <div></div>
            <BookmarkManageContainer>
                <BookmarkManagebuttonContainer>
                    <div>바로삭제 확인, 아니면 시간내 누르면 복구버튼?</div>
                    <button onClick={bookmarkRefresh}>북마크 전체보기</button>
                    <button onClick={bookmarkCreate}>북마크 생성</button>
                </BookmarkManagebuttonContainer>
                {useModal.isShowModal ? <BookmarkModalPage useModal={useModal} setNewBookmark={setNewBookmark} /> : null}
                <Bookmarks bookmarkView={bookmarkView} getTagBookmark={getTagBookmark} onBookmarkDelete={onBookmarkDelete} editSave={editSave}/>
                <PageMove count={localBookmarkPage.length} pagenationNum={pagenationNum} currentPageNum={currentPageNum}/>
            </BookmarkManageContainer>
        </BookmarkContainer>
    )
};

//로컬에 저장된거 암호화 못시키나? 가져올때 원복시키면 되지 않을까?
//export default BookMark

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