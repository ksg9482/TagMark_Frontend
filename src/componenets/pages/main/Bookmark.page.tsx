import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { dumyBookmark } from "../../../dumy/dumy-bookmarks";
import { dumyTags } from "../../../dumy/dumy-tags";
import { Bookmark, CreateBookmarkData } from "../../../interface/bookmark";
import { Tag } from "../../../interface/tag";
import { customAxios } from "../../../utils/axios/customAxios";
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

export interface LocalBookmark {
    dataFrom: 'local', bookmark: string 
}
export interface RemoteBookmark {
    dataFrom: 'remote', bookmark: AxiosResponse
}

type GetBookmarkOption = LocalBookmark | RemoteBookmark;


export const BookMark = (props: any) => {
    const isLogin = props.isLogin
    const secureStorage = secure().local();
    const secureWrap = secure().wrapper()
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
    // const [isLogin, setIsLogin] = useState(false)

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
        const tempBookmark = bookmarkArr.map((bookmark)=>{
            const tags = bookmark.tags ? bookmark.tags : []
            return {...bookmark, tags:tags}
        })
        const bookmarkFilter = tempBookmark.filter((bookmark) => {
            const tagFilter = bookmark.tags.filter((tag:any) => {
                const tempTag = tag.name ? tag.name : tag.tag
                return targetTags.includes(tempTag)
            })
            if (1 <= tagFilter.length) return tagFilter
        })
        console.log(bookmarkFilter)
        //페이지네이션으로 안나옴
        //console.log(bookmarkFilter.length, bookmarkFilter)
        setLocalBookmarkPage(setLocalPagenation(bookmarkFilter, 20))
            // //해당하는페이지 보여줌
        createBookmarkView(setLocalPagenation(bookmarkFilter, 20),currentPageNum -1)
        //return setBookmarkView(bookmarkFilter)
    };

    const bookmarkAdapter = (storageType: 'local' |'remote',bookmarks:any): Bookmark[] => {
        const localToBookmarkForm = (bookmarks:string)=> {
            const jsonParsedData = JSON.parse(bookmarks);
            const encrypted = jsonParsedData.map((bookmark:Bookmark)=>{
                return {...bookmark, url:secureWrap.encryptWrapper(bookmark.url)}
            })
            if (!jsonParsedData) {
                return [bookmarkInitData]; //형식만 맞춘 빈데이터
            };
            return  encrypted;
        };
        const remoteToBookmarkForm = (bookmarks:Bookmark[]) => {
            const data = bookmarks;
            const encrypted = data.map((bookmark:Bookmark)=>{
                return {...bookmark, url:secureWrap.encryptWrapper(bookmark.url)}
            })
            return  encrypted;
        };
        if(storageType === "local"){
            return localToBookmarkForm(bookmarks)
        }
        else {
            return remoteToBookmarkForm(bookmarks)
        } 
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
    
   
    
    
    const sendGetTags = async () => {
        try {
            const tags = await customAxios.get(`/tag`)
        } catch (error) {
            console.log(error)
        }
    }
    
    const sendsearchTagBookmark = () => {
        const sendGetAndSearch = async () => {
                const query = 'query1+query2'
                const boookmarks = await customAxios.get(`/tag/search-and?query=${query}`)
        }
        const sendGetOrSearch = async () => {
                const query = 'query1+query2'
                const boookmarks = await customAxios.get(`/tag/search-or?query=${query}`)
        }
        return {
            sendGetAndSearch, sendGetOrSearch
        }
    }
    
    //북마크 읽기
    const getLocalBookmarks = () => {
        const localBookmarks = secure().local().getItem('local-bookmark-storage')!
        const bookmark = bookmarkAdapter("local",localBookmarks);
        return bookmark
    }
    const getDBBookmarks = async () => {
        const bookmarkResponse = await customAxios.get(`/bookmark`)
        const bookmark = bookmarkAdapter("remote",bookmarkResponse.data.bookmarks);
        return bookmark
        
    }
    
    const getBookmark = async (isLogin: boolean) => {
        try {
            const bookmark = isLogin? await getDBBookmarks() : getLocalBookmarks()
        
            //원본저장
            setOriginBookmarks(bookmark);
            //페이지네이션 별로 구분
            setLocalBookmarkPage(setLocalPagenation(bookmark, 20))
            // //해당하는페이지 보여줌
            createBookmarkView(setLocalPagenation(bookmark, 20),currentPageNum -1)
            // return setBookmarkView(bookmark);
        } catch (error) {
            console.log(error)
        }
        
    };

    const bookmarkRefresh = () => {
        setBookmarkView(localBookmarkPage[0]) //페이지네이션 한걸로 해야 함
    };

    const bookmarkCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        useModal.openModal();
    };
    const saveNewBookmarkStorage = (newBookmarkData: Bookmark | Bookmark[]) => {
        //이미 암호화 되어있는게 다시 들어옴 -> 재암호화
        
        if (!isLogin) {
            secureStorage.removeItem('local-bookmark-storage')
            secureStorage.setItem('local-bookmark-storage', JSON.stringify(newBookmarkData))
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
    // 북마크 생성
    const sendCreateBookmark = async () => {
        try {
            const encrypted = secureWrap.encryptWrapper('test')
            const boookmarks = await customAxios.get(`/bookmark/mybookmark`)
        } catch (error) {
            console.log(error)
        }
    }
    const setNewBookmark = (createBookmarkData: CreateBookmarkData) => {
        const lastId = originBookmarks[0].id
        const id = lastId + 1;
        const url = createBookmarkData.url //암호? 평문? 공백인거 보면 문제가?
        const tags = createBookmarkData.tags.map((tag, i) => {
            return { id: 'tempTag' + i, name: tag }
        })

        //태그 중복 방지는?
        const newBookmarkArr: Bookmark[] = [{ id, url, tags }]
        //newBookmarkArr.push(...bookmarkView)
        const decrypted = originBookmarks.map((bookmark)=>{
            const url = secureWrap.decryptWrapper(bookmark.url)
            return {...bookmark, url:url}
        })
        newBookmarkArr.push(...decrypted)
        const encryptedArr = newBookmarkArr.map((bookmark)=>{
            const url = secureWrap.encryptWrapper(bookmark.url)
            return {...bookmark, url:url}
        })
        console.log('setNewBookmark에서 생성',newBookmarkArr, encryptedArr)
        bookmarkSequence(newBookmarkArr)
        setLocalBookmarkPage(setLocalPagenation(encryptedArr, 20))
        // //해당하는페이지 보여줌
        createBookmarkView(setLocalPagenation(encryptedArr, 20),currentPageNum -1)
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
    // 북마크 제거
    //어차피 북마크 에디트할꺼면 프론트에서 태그보내고 백에서 변동사항 처리하는 김에 연결 끊으면 안되나?
    //이렇게 지우는 거랑, 북마크 에디트 할때 같이 하는거랑 뭐가 나을까?
    const sendDeleteBookmarkTag = async () => {
        try {
            const bookmarkId = 1
            const query = 1
            const boookmarks = await customAxios.get(`/tag/${bookmarkId}?tagIds=${query}`)
        } catch (error) {
            console.log(error)
        }
    }
    const sendDeleteBookmark = async () => {
        try {
            const bookmarkId = 1
            const boookmarks = await customAxios.delete(`/bookmark${bookmarkId}`)
        } catch (error) {
            console.log(error)
        }
    }
    const onBookmarkDelete = (targetBookmarkId: any) => {
        //sendDeleteBookmark
        const length = originBookmarks.length;
        const isMachedIndex = getMachedIndex(targetBookmarkId)
        const decrypted = originBookmarks.map((bookmark)=>{
            const url = secureWrap.decryptWrapper(bookmark.url)
            return {...bookmark, url:url}
        })
        const deletedBookmark = [...decrypted.slice(0, isMachedIndex), ...decrypted.slice(isMachedIndex + 1, length)]
        bookmarkSequence(deletedBookmark)
    }

    //북마크 수정
    const sendEditBookmark = async () => {
        try {
            const encrypted = secureWrap.encryptWrapper('test')
            const bookmarkId = 1
            const boookmarks = await customAxios.patch(`/bookmark/${bookmarkId}`, encrypted)
        } catch (error) {
            console.log(error)
        }
    }
    //동작이 생성과 비슷한데 재활용 방법은? 더 고도화하면 분리될 수 있으니 따로하는게 좋을까?
    const editSave = (targetBookmarkId:any, editContent:any) => {
        const url = editContent.url
        const tags = editContent.tags.map((tag:any, i:number) => {
            return { id: 'tempTag' + i, name: tag.name }
        })
        const length = originBookmarks.length;
        const isMachedIndex = getMachedIndex(targetBookmarkId)
        const decrypted = originBookmarks.map((bookmark)=>{return {...bookmark, url:secureWrap.decryptWrapper(bookmark.url)} })
        
        //평문
        const editedBookmark:Bookmark[] = [...decrypted.slice(0, isMachedIndex),{id:targetBookmarkId, url:url, tags:tags}, ...decrypted.slice(isMachedIndex + 1, length)]
        
        //암호문
        const encryptedArr = editedBookmark.map((bookmark)=>{
            const url = secureWrap.encryptWrapper(bookmark.url)
            return {...bookmark, url:url}
        })
        
        console.log('setNewBookmark에서 생성',editedBookmark, encryptedArr)
        bookmarkSequence(editedBookmark)
        //내용갱신이 안된거처럼 보여서 그러는거 아닐까?
        setLocalBookmarkPage(setLocalPagenation(encryptedArr, 20))
        // //해당하는페이지 보여줌
        createBookmarkView(setLocalPagenation(encryptedArr, 20),currentPageNum -1)
        //login? 서버 저장
        // eslint-disable-next-line no-restricted-globals
        location.reload()

        //no login? 로컬 저장.
    }

    const pagenationNum = (num:number) => {
        setCurrentPageNum(num)
        currentPageRefresh(num)
    } 
    // useEffect(() => {
    //     setIsLogin(props.isLogin)
    // },[isLogin])

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
            <SideBar getTagBookmark={getTagBookmark} originBookmarks={originBookmarks} isLogin={props.isLogin}/>
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