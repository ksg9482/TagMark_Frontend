import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { dumyBookmark } from "../../../dumy/dumy-bookmarks";
import { dumyTags } from "../../../dumy/dumy-tags";
import { Bookmark, CreateBookmarkData } from "../../../interface/bookmark";
import { Tag } from "../../../interface/tag";
import { deepCopy, secure } from "../../../utils";
import { customAxios } from "../../../utils/axios/customAxios";
import Bookmarks from "../../blocks/bookmark/Bookmarks";
import { PageMove } from "../../blocks/bookmark/pageMove/PageMove";
import SideBar from "../../blocks/sidebar/Sidebar";
import { BookmarkModalPage } from "../modal/BookmarkModalPage";
import { BookmarkContainer, BookmarkManagebuttonContainer, BookmarkManageContainer } from "./styles";

//로딩중 페이지 만들기
/*
암호화 방침
state: 암호로 저장
서버통신: 그냥 평문. https로 보안
내부처리: 평문으로 처리하고, 괜히 객체, 문자열 뒤섞지 말고 상태에 저장은 암호화 문자열
          어뎁터를 둬서 json, decrypt까지 일괄처리 -> 평문화 된거 받음.
props: 상태를 내려주는 거면 내부에서 복호화 처리한다. 개별 컴포넌트 말고 그 위 ~'s에서 바꿔서 보내줌
프롭스 노출되면 그냥 개별에서 바꾸기
*/

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
enum CurrentSearch {
    Bookmark = 'Bookmark',
    TagSearch = 'TagSearch',
    SideBarSearch = 'SideBarSearch'
}

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
            tag: ''
        }]
    }
    //전부 갖고 있음. 유지용
    const [originBookmarks, setOriginBookmarks] = useState([bookmarkInitData]);
    const [originPageCount, setOriginPageCount] = useState(0);
    const [originTotalCount, setOriginTotalCount] = useState(0);
    //페이지 보이기용
    const [bookmarkView, setBookmarkView] = useState([bookmarkInitData]);
    //로컬 페이지네이션
    const [localBookmarkPage, setLocalBookmarkPage] = useState([[bookmarkInitData]]);
    //로컬 스토리지에 숫자 저장해서 쓰는걸로? 
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [currentTag, setCurrentTag] = useState(['']);
    const [totalCount, setTotalCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentSearch, setCurrentSearch] = useState(CurrentSearch.Bookmark);


    const updateCurrentTag = (targetTag: any) => {
        if (currentTag.includes(targetTag)) {
            return;
        }
        if (!currentTag[0]) {
            setCurrentTag([targetTag])
        }
        else {
            setCurrentTag([...currentTag, targetTag])
        }

    }
    const updateCurrentTagSideBar = (targetTag: any) => {
        setCurrentTag([targetTag])
    }
    const getRemoteTagBookmark = async (targetTags: string[]) => {
        currentPageRefresh(1)
        const prevTag: any[] = currentTag
        if (currentTag[0] !== '' && !currentTag.includes(targetTags[0])) {
            targetTags.push(...prevTag)
        }
        if (currentTag.includes(targetTags[0])) {
            targetTags = prevTag
        }

        //이거 앞에서 미리 처리해야 함
        const blankChange = targetTags.map((tag) => {
            return tag.replaceAll(' ', '%20')
        })

        //띄어쓰기 문제 해결!!
        //사이드바 검색이 우선되게. 같은 로직 공유하니 and로 자동 적용됨
        const andSearch = await customAxios.get(`/tag/search-and?tags=${blankChange}&pageNo=1`)
        
        if (andSearch.data.bookmarks.length <= 0) {
            return bookmarkView
        }
        const bookmarkArr: Bookmark[] = originBookmarks;

        const tempBookmark = bookmarkArr.map((bookmark) => {
            const tags = bookmark.tags ? bookmark.tags : []
            return { ...bookmark, tags: tags }
        })
        const bookmarkFilter = tempBookmark.filter((bookmark) => {
            const tagFilter = bookmark.tags.filter((tag: any) => {
                return targetTags.includes(tag.tag)
            })
            if (1 <= tagFilter.length) return tagFilter
        })
        return andSearch.data
    }
    const getRemoteTagBookmarkSideBar = async (targetTags: string[]) => {
        currentPageRefresh(1)
        const andSearch = await customAxios.get(`/tag/search-or?tags=${targetTags}&pageNo=1`)

        if (andSearch.data.bookmarks.length <= 0) {
            console.log(andSearch.data.bookmarks, '없음')
            return bookmarkView
        }
        const bookmarkArr: Bookmark[] = originBookmarks;

        const tempBookmark = bookmarkArr.map((bookmark) => {
            const tags = bookmark.tags ? bookmark.tags : []
            return { ...bookmark, tags: tags }
        })
        const bookmarkFilter = tempBookmark.filter((bookmark) => {
            const tagFilter = bookmark.tags.filter((tag: any) => {
                return targetTags.includes(tag.tag)
            })
            if (1 <= tagFilter.length) return tagFilter
        })
        return andSearch.data
    }
    const getTagBookmark = async (targetTags: string[], findType: FindType) => {
        //태그 눌러가면서 원하는거 좁혀가려면?
        
        if (!currentTag.includes(targetTags[0])) {
            updateCurrentTag(targetTags.join())
        }

        let searched: Bookmark[]
        if (isLogin) {
            const result = await getRemoteTagBookmark(targetTags)
            searched = result.bookmarks
            console.log(result)
            updateTotalCount(result.totalCount)
            updatePageCount(result.totalPage)
        }
        else {
            const bookmarkArr: Bookmark[] = findType === 'origin' ? originBookmarks : bookmarkView;
            const tempBookmark = bookmarkArr.map((bookmark) => {
                const tags = bookmark.tags ? bookmark.tags : []
                return { ...bookmark, tags: tags }
            })
            const bookmarkFilter = tempBookmark.filter((bookmark) => {
                const tagFilter = bookmark.tags.filter((tag: any) => {
                    return targetTags.includes(tag.tag)
                })
                if (1 <= tagFilter.length) return tagFilter
            })
            searched = bookmarkFilter
        }

        console.log(searched)
        setCurrentSearch(CurrentSearch.TagSearch)
        setLocalBookmarkPage(setLocalPagenation(searched, 20))
        // //해당하는페이지 보여줌
        //createBookmarkView(setLocalPagenation(searched, 20), currentPageNum - 1)
        updateBookmarkView(searched)
        //return setBookmarkView(bookmarkFilter)
    };

    const getTagBookmarkSideBar = async (targetTags: string[], findType: FindType) => {
        //태그 눌러가면서 원하는거 좁혀가려면?
        let searched: Bookmark[]
        currentPageRefresh(1)
        if (isLogin) {
            const result = await getRemoteTagBookmarkSideBar(targetTags)
            searched = result.bookmarks
            updateTotalCount(result.totalCount)
            updatePageCount(result.totalPage)
        }
        else {
            const bookmarkArr: Bookmark[] = findType === 'origin' ? originBookmarks : bookmarkView;
            const tempBookmark = bookmarkArr.map((bookmark) => {
                const tags = bookmark.tags ? bookmark.tags : []
                return { ...bookmark, tags: tags }
            })
            const bookmarkFilter = tempBookmark.filter((bookmark) => {
                const tagFilter = bookmark.tags.filter((tag: any) => {
                    return targetTags.includes(tag.tag)
                })
                if (1 <= tagFilter.length) return tagFilter
            })
            searched = bookmarkFilter
        }
        setCurrentSearch(CurrentSearch.SideBarSearch)
        //url 암호화 문제
        updateCurrentTagSideBar(targetTags.join())

        setLocalBookmarkPage(setLocalPagenation(searched, 20))
        // //해당하는페이지 보여줌
        createBookmarkView(setLocalPagenation(searched, 20), currentPageNum - 1)
        //return setBookmarkView(bookmarkFilter)
    };

    const bookmarkAdapter = (storageType: 'local' | 'remote', bookmarks: any): Bookmark[] => {
        const localToBookmarkForm = (bookmarks: string) => {
            const jsonParsedData = JSON.parse(bookmarks);
            const encrypted = jsonParsedData.map((bookmark: Bookmark) => {
                return { ...bookmark, url: secureWrap.encryptWrapper(bookmark.url) }
            })
            if (!jsonParsedData) {
                return [bookmarkInitData]; //형식만 맞춘 빈데이터
            };
            return encrypted;
        };
        const remoteToBookmarkForm = (bookmarks: Bookmark[]) => {
            const data = bookmarks;
            const encrypted = data.map((bookmark: Bookmark) => {
                return { ...bookmark, url: secureWrap.encryptWrapper(bookmark.url) }
            })
            return encrypted;
        };
        if (storageType === "local") {
            return localToBookmarkForm(bookmarks)
        }
        else {
            return remoteToBookmarkForm(bookmarks)
        }
    };
    const setLocalPagenation = (bookmark: Bookmark[], pageCount: number) => {
        const copy = deepCopy(bookmark)
        const length = bookmark.length;
        const cnt = Math.floor(length / pageCount) + (Math.floor(length % pageCount) > 0 ? 1 : 0);
        const result: Bookmark[][] = [];
        for (let i = 0; i < cnt; i++) {
            result.push(copy.splice(0, pageCount))
        }
        console.log(result)
        return result
    }

    //이거 둘이 정리
    const createBookmarkView = (pagenationBookmark: Bookmark[][], targetPage: number) => {
        console.log(pagenationBookmark, targetPage)
        setBookmarkView(pagenationBookmark[targetPage])
    }

    const updateBookmarkView = (bookmarks: Bookmark[]) => {
        setBookmarkView(bookmarks)
    }




    const sendGetTags = async () => {
        try {
            const tags = await customAxios.get(`/tag`)
        } catch (error) {
            console.log(error)
        }
    }

    // const sendsearchTagBookmark = () => {
    //     const sendGetAndSearch = async () => {
    //         const query = 'query1+query2'
    //         const boookmarks = await customAxios.get(`/tag/search-and?query=${query}&pageNo=1`)
    //     }
    //     const sendGetOrSearch = async () => {
    //         const query = 'query1+query2'
    //         const boookmarks = await customAxios.get(`/tag/search-or?query=${query}&pageNo=1`)
    //     }
    //     return {
    //         sendGetAndSearch, sendGetOrSearch
    //     }
    // }

    //북마크 읽기
    const getLocalBookmarks = () => {
        const localBookmarks = secure().local().getItem('local-bookmark-storage')!
        const bookmark = bookmarkAdapter("local", localBookmarks);
        updateTotalCount(bookmark.length)
        return bookmark
    }
    const updateTotalCount = (count: number) => {
        setTotalCount(count)
    };
    const updatePageCount = (count: number) => {
        setPageCount(count)
    };
    const updateOriginPageCount = (count: number) => {
        setOriginPageCount(count)
    }
    const updateOriginTotalCount = (count: number) => {
        setOriginTotalCount(count)
    }
    //pageNo 페이지버튼 클릭하면 이거 변경
    const getDBBookmarks = async () => {
        const currentPageCount = sessionStorage.getItem('current-page') || 1
        const bookmarkResponse = await customAxios.get(`/bookmark?pageNo=${currentPageCount}`)
        if (bookmarkResponse.data.bookmarks.length <= 0) {
            //결과 없을땐 어떻게??
            return bookmarkView
        }
        updateOriginPageCount(bookmarkResponse.data.totalPage)
        updateOriginTotalCount(bookmarkResponse.data.totalCount)
        updateTotalCount(bookmarkResponse.data.totalCount)
        updatePageCount(bookmarkResponse.data.totalPage)
        console.log(bookmarkResponse)
        const bookmark = bookmarkAdapter("remote", bookmarkResponse.data.bookmarks);
        return bookmark

    }

    const getBookmark = async (isLogin: boolean) => {
        try {
            const bookmark = isLogin ? await getDBBookmarks() : getLocalBookmarks()

            //원본저장
            setOriginBookmarks(bookmark);
            //페이지네이션 별로 구분
            setLocalBookmarkPage(setLocalPagenation(bookmark, 20))
            // //해당하는페이지 보여줌
            createBookmarkView(setLocalPagenation(bookmark, 20), currentPageNum - 1)
            // return setBookmarkView(bookmark);
        } catch (error) {
            console.log(error)
        }

    };

    //상태 정리 해야 함. 상태가 꼬여있어서 복잡해진거 해결 안됨
    const bookmarkRefresh = () => {
        console.log(originBookmarks)
        setCurrentSearch(CurrentSearch.Bookmark)
        setBookmarkView(setLocalPagenation(originBookmarks, 20)[0]) //페이지네이션 한걸로 해야 함
        setCurrentTag([])
        updateOriginPageCount(originPageCount)
        currentPageRefresh(1)
        if(isLogin) {
            updatePageCount(originPageCount)
            updateTotalCount(originTotalCount)
        }
        else {
            updateTotalCount(originBookmarks.length)
        }
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

    const updateOriginBookmark = (bookmarks: Bookmark[]) => {
        setOriginBookmarks(bookmarks)
    }
    const bookmarkSequence = (newBookmarks: Bookmark[]) => {
        updateOriginBookmark(newBookmarks)
        saveNewBookmarkStorage(newBookmarks)
        updateBookmarkView(newBookmarks)
        //currentPageRefresh(1)

    }
    // 북마크 생성
    //사이드바랑 바로 연동안됨
    const sendCreateBookmark = async (newBookmarkData: CreateBookmarkData) => {
        try {
            const encrypted = secureWrap.encryptWrapper('test')
            const boookmarks = await customAxios.post(`/bookmark`, {
                ...newBookmarkData
            })
            //console.log(boookmarks)
        } catch (error) {
            console.log(error)
        }
    }
    const setNewBookmark = (createBookmarkData: CreateBookmarkData) => {
        //로컬(로컬에 저장), 리모트(서버 전송, 로컬저장), 공통필요(변동사항을 view에 적용)
        //if로 로그인 상태일때만 서버에 전송하는 과정 추가하는 쪽으로 개발
        const lastId = originBookmarks[0].id
        const id = lastId + 1;
        const url = createBookmarkData.url //암호? 평문? 공백인거 보면 문제가?
        console.log(createBookmarkData.tags)
        const tags = createBookmarkData.tags.map((tag, i) => {
            return { id: 'tempTag' + i, tag: tag }
        })

        if (isLogin) {
            sendCreateBookmark({ url, tags: createBookmarkData.tags })
        }
        //태그 중복 방지는?
        const newBookmarkArr: Bookmark[] = [{ id, url, tags }]
        //newBookmarkArr.push(...bookmarkView)
        const decrypted = originBookmarks.map((bookmark) => {
            const url = secureWrap.decryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })
        newBookmarkArr.push(...decrypted)
        const encryptedArr = newBookmarkArr.map((bookmark) => {
            const url = secureWrap.encryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })
        //console.log('setNewBookmark에서 생성',newBookmarkArr, encryptedArr)
        bookmarkSequence(newBookmarkArr)
        setLocalBookmarkPage(setLocalPagenation(encryptedArr, 20))
        // //해당하는페이지 보여줌
        createBookmarkView(setLocalPagenation(encryptedArr, 20), currentPageNum - 1)
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
    const sendDeleteBookmark = async (bookmarkId: any) => {
        console.log(bookmarkId)
        try {
            const boookmarks = await customAxios.delete(`/bookmark/${bookmarkId}`)
        } catch (error) {
            console.log(error)
        }
    }
    const onBookmarkDelete = async (targetBookmarkId: any) => {
        if (isLogin) {
            await sendDeleteBookmark(targetBookmarkId)
        }
        const length = originBookmarks.length;
        const isMachedIndex = getMachedIndex(targetBookmarkId)
        const decrypted = originBookmarks.map((bookmark) => {
            const url = secureWrap.decryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })
        const deletedBookmark = [...decrypted.slice(0, isMachedIndex), ...decrypted.slice(isMachedIndex + 1, length)]
        bookmarkSequence(deletedBookmark)
    }

    //북마크 수정
    const editForm = (booomarkId: any, originBookmark: Bookmark, editContent: Bookmark) => {
        //암호화 url 받음
        const decrypytedOrigin = { ...originBookmark, url: secureWrap.decryptWrapper(originBookmark.url) }
        const decrypytedEdit = { ...editContent, url: secureWrap.decryptWrapper(editContent.url) }
        let changeForm: any = {};


        const addTag = decrypytedEdit.tags.filter((editTag) => {
            return !decrypytedOrigin.tags.some((originTag) => {
                return originTag.tag === editTag.tag
            })
        })

        const deleteTag = decrypytedOrigin.tags.filter((originTag) => {
            return !decrypytedEdit.tags.some((editTag) => {
                return originTag.tag === editTag.tag
            })
        })

        if (decrypytedOrigin.url !== decrypytedEdit.url) {
            changeForm.changeUrl = decrypytedEdit.url
        }
        if (addTag.length > 0) {
            changeForm.addTag = addTag.map((tag) => { return tag.tag })
        }
        if (deleteTag.length > 0) {
            changeForm.deleteTag = deleteTag.map((tag) => { return tag.id })
        }


        return changeForm;
    }
    const sendEditBookmark = async (targetBookmarkId: any, editContent: any) => {
        try {
            const editResult = await customAxios.patch(
                `/bookmark/${targetBookmarkId}`,
                { ...editContent }
            )
        } catch (error) {
            console.log(error)
        }
    }
    //동작이 생성과 비슷한데 재활용 방법은? 더 고도화하면 분리될 수 있으니 따로하는게 좋을까?
    const editSave = (targetBookmarkId: any, originBookmark: any, editContent: any) => {
        const url = editContent.url
        const tags = editContent.tags.map((tag: any, i: number) => {
            return { id: 'tempTag' + i, tag: tag.tag }
        })
        if (isLogin) {

            const editFrom = editForm(targetBookmarkId, originBookmark, editContent)
            sendEditBookmark(targetBookmarkId, editFrom)
        }
        const length = originBookmarks.length;
        const isMachedIndex = getMachedIndex(targetBookmarkId)
        const decrypted = originBookmarks.map((bookmark) => { return { ...bookmark, url: secureWrap.decryptWrapper(bookmark.url) } })

        //평문
        const editedBookmark: Bookmark[] = [...decrypted.slice(0, isMachedIndex), { id: targetBookmarkId, url: url, tags: tags }, ...decrypted.slice(isMachedIndex + 1, length)]

        //암호문
        const encryptedArr = editedBookmark.map((bookmark) => {
            const url = secureWrap.encryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })

        bookmarkSequence(editedBookmark)
        //내용갱신이 안된거처럼 보여서 그러는거 아닐까?
        setLocalBookmarkPage(setLocalPagenation(encryptedArr, 20))
        // //해당하는페이지 보여줌
        createBookmarkView(setLocalPagenation(encryptedArr, 20), currentPageNum - 1)
        //login? 서버 저장
        // eslint-disable-next-line no-restricted-globals
        //location.reload()
        //no login? 로컬 저장.
    }
    
    const pagenationNum = async (num: number) => {
        //여러가지 get요청중에서 어떤걸로 했는지 확인해야함
        if (isLogin) {
            if (currentSearch === CurrentSearch.Bookmark) {
                console.log('bookmark move')
                const bookmarks = await customAxios.get(`/bookmark?pageNo=${num}`)
                console.log(bookmarks)
                setCurrentSearch(CurrentSearch.Bookmark)
                setOriginBookmarks(bookmarks.data.bookmarks);
                setLocalBookmarkPage(setLocalPagenation(bookmarks.data.bookmarks, 20))
                updateBookmarkView(bookmarks.data.bookmarks)
            }
            if (currentSearch === CurrentSearch.TagSearch) {
                console.log('tag move')
                const andSearch = await customAxios.get(`/tag/search-and?tags=${currentTag.join('+')}&pageNo=${num}`)
                console.log(andSearch)
                setCurrentSearch(CurrentSearch.TagSearch)
                setOriginBookmarks(andSearch.data.bookmarks);
                setLocalBookmarkPage(setLocalPagenation(andSearch.data.bookmarks, 20))
                updateBookmarkView(andSearch.data.bookmarks)
            }
            if (currentSearch === CurrentSearch.SideBarSearch) { 
                console.log('sidebar move')
                const orSearch = await customAxios.get(`/tag/search-or?tags=${currentTag.join('+')}&pageNo=${num}`)
                console.log(orSearch)
                setCurrentSearch(CurrentSearch.SideBarSearch)
                setOriginBookmarks(orSearch.data.bookmarks);
                setLocalBookmarkPage(setLocalPagenation(orSearch.data.bookmarks, 20))
                updateBookmarkView(orSearch.data.bookmarks)
            }
            setCurrentPageNum(num)
            currentPageRefresh(num)
        }
        else {
            setCurrentPageNum(num)
            currentPageRefresh(num)
        }

    }
    // useEffect(() => {
    //     setIsLogin(props.isLogin)
    // },[isLogin])
    const paginationCount = () => {
        if (isLogin) {
            return pageCount
        }
        return localBookmarkPage.length
    }
    useEffect(() => {
        //이거 리덕스로 옮겨서 관리? 아니면 최상단으로 올려서 프롭스로 내릴까?
        if (!isLogin && !secure().local().getItem('local-bookmark-storage')) {
            secure().local().setItem('local-bookmark-storage', JSON.stringify(dumyBookmark))
        }
        getBookmark(isLogin)
    }, [])
    //세션스토리지 관련을 함수로 묶자
    const currentPageRefresh = (currentPage: number) => {

        window.sessionStorage.removeItem('current-page')
        window.sessionStorage.setItem('current-page', String(currentPage))
    };

    useEffect(() => {
        const isPage = Number(window.sessionStorage.getItem('current-page'));
        if (isPage) {
            setCurrentPageNum(isPage)
        }
        else {
            window.sessionStorage.setItem('current-page', String(currentPageNum));
        }
    }, [])

    useEffect(() => {
        if (!isLogin) {
            createBookmarkView(setLocalPagenation(originBookmarks, 20), currentPageNum - 1)
        }
    }, [originBookmarks, currentPageNum])
console.log('bookmarkView -', bookmarkView)
    return (
        <BookmarkContainer>
            <SideBar getTagBookmarkSideBar={getTagBookmarkSideBar} originBookmarks={originBookmarks} isLogin={props.isLogin} />
            <div></div>
            <BookmarkManageContainer>
                <BookmarkManagebuttonContainer>
                    <div>총 {totalCount}개 북마크</div>
                    <button onClick={bookmarkRefresh}>북마크 전체보기</button>
                    <button onClick={bookmarkCreate}>북마크 생성</button>
                </BookmarkManagebuttonContainer>
                <div>{currentTag[0]?.length > 0 ? currentTag.join(', ') : <div>&nbsp;</div>}</div>
                {useModal.isShowModal ? <BookmarkModalPage useModal={useModal} setNewBookmark={setNewBookmark} /> : null}
                <Bookmarks bookmarkView={bookmarkView} getTagBookmark={getTagBookmark} onBookmarkDelete={onBookmarkDelete} editSave={editSave} />
                <PageMove count={paginationCount()} pagenationNum={pagenationNum} currentPageNum={currentPageNum} />
            </BookmarkManageContainer>
        </BookmarkContainer>
    )
};

//로컬에 저장된거 암호화 못시키나? 가져올때 원복시키면 되지 않을까?
//export default BookMark