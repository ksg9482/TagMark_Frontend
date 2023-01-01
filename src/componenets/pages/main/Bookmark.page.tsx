import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { dumyBookmark } from "../../../dumy/dumy-bookmarks";
import { dumyTags } from "../../../dumy/dumy-tags";
import { Bookmark, CreateBookmarkData } from "../../../interface/bookmark";
import { Tag } from "../../../interface/tag";
import { deepCopy, secure } from "../../../utils";
import { customAxios } from "../../../utils/axios/customAxios";
import Bookmarks from "../../blocks/bookmark/Bookmarks";
import { PageMove } from "../../blocks/bookmark/pageMove/PageMove";
import SideBar from "../../blocks/sidebar/Sidebar";
import { BookmarkCreateBlock } from "../../blocks/bookmark/BookmarkCreateBlock";
import { BookmarkContainer, BookmarkManagebuttonContainer, BookmarkManageContainer, CommonButton, ContentBox, ManageButtonContainer, TagText } from "./styles";
import { LoadingBar } from "../../blocks/common/loading/loading";
import { Helmet } from "react-helmet-async";


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
    //비로그인시 이거 length로 페이지카운트 삼음
    const [localBookmarkPage, setLocalBookmarkPage] = useState([[bookmarkInitData]]);
    //로컬 스토리지에 숫자 저장해서 쓰는걸로? 
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [currentTag, setCurrentTag] = useState(['']);
    const [totalCount, setTotalCount] = useState(0);
    const [pageCount, setPageCount] = useState(0); //로그인시 페이지 카운트
    const [currentSearch, setCurrentSearch] = useState(CurrentSearch.Bookmark);

    const [firstPage, setFirstPage] = useState([bookmarkInitData])

    const [load, setLoad] = useState(true);

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

        
        const blankChange = targetTags.map((tag) => {
            return tag.replaceAll(' ', '%20')
        })

        console.log(blankChange)
        const andSearch = await customAxios.get(`/tag/search-and?tags=${blankChange}&pageNo=1`)
        console.log(andSearch)
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
        console.log(targetTags)
        const orSearch = await customAxios.get(`/tag/search-or?tags=${targetTags}&pageNo=1`)
        console.log(orSearch)
        if (orSearch.data.bookmarks.length <= 0) {
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
        return orSearch.data
    }
    //로컬시 pageMove로 움직이면 원래 없어야 하는 북마크도 보임. 1로 옮기면서 그대로 복붙하니 그런듯?
    const getTagBookmark = async (targetTags: string[], findType: FindType) => {
        
        currentPageRefresh(1)
        if (!currentTag.includes(targetTags[0])) {
            updateCurrentTag(targetTags.join())
        }

        let searched: Bookmark[]
        if (isLogin) {
            const result = await getRemoteTagBookmark(targetTags)
            searched = result.bookmarks
            updateBookmarkView(searched)
            updateTotalCount(result.totalCount)
            updatePageCount(result.totalPage)
        }
        else {
            const prevTag: any[] = currentTag
            if (currentTag[0] !== '' && !currentTag.includes(targetTags[0])) {
                targetTags.push(...prevTag)
            }
            if (currentTag.includes(targetTags[0])) {
                targetTags = prevTag
            }

            const bookmarkArr: Bookmark[] = findType === 'origin' ? originBookmarks : bookmarkView;
            const prevBookmark = bookmarkArr.map((bookmark) => {
                const tags = bookmark.tags ? bookmark.tags : []
                return { ...bookmark, tags: tags }
            })

            const bookmarkFilter = prevBookmark.filter((bookmark) => {
                return targetTags.every((tagStr) => {
                    return bookmark.tags.some((tag) => {
                        return tag.tag === tagStr
                    })
                })
            })
            
            searched = bookmarkFilter
            updateBookmarkView(setLocalPagenation(searched, 20)[0])
            setLocalBookmarkPage(setLocalPagenation(searched, 20))
            updateTotalCount(bookmarkFilter.length)
            updatePageCount(Math.ceil(bookmarkFilter.length/20))
        }

        setCurrentSearch(CurrentSearch.TagSearch)
        setCurrentPageNum(1)
    };

    const getTagBookmarkSideBar = async (targetTags: string[], findType: FindType) => {
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
            updateTotalCount(bookmarkFilter.length)
            updatePageCount(Math.ceil(bookmarkFilter.length/20))
        }
        setCurrentSearch(CurrentSearch.SideBarSearch)
        updateCurrentTagSideBar(targetTags.join())

        setLocalBookmarkPage(setLocalPagenation(searched, 20))
        createBookmarkView(setLocalPagenation(searched, 20), currentPageNum - 1)
        updateBookmarkView(searched)
        setCurrentPageNum(1)
        
    };

    const bookmarkAdapter = (storageType: 'local' | 'remote', bookmarks: any): Bookmark[] => {
        const localToBookmarkForm = (bookmarks: string) => {
            const jsonParsedData = JSON.parse(bookmarks);
            const encrypted = jsonParsedData.map((bookmark: Bookmark) => {
                return { ...bookmark, url: secureWrap.encryptWrapper(bookmark.url) }
            })
            if (!jsonParsedData) {
                return [bookmarkInitData]; 
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
        return result
    }

   
    const createBookmarkView = (pagenationBookmark: Bookmark[][], targetPage: number) => {
        
        setBookmarkView(pagenationBookmark[targetPage])
    }

    const updateBookmarkView = (bookmarks: Bookmark[]) => {
        setBookmarkView(bookmarks)
    }

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
    
    const getDBBookmarks = async () => {
        const currentPageCount = sessionStorage.getItem('current-page') || 1
        const bookmarkResponse = await customAxios.get(`/bookmark?pageNo=${currentPageCount}`)
        console.log(bookmarkResponse.data)
        if (bookmarkResponse.data.bookmarks.length <= 0) {
            return bookmarkView
        }

        updateOriginPageCount(bookmarkResponse.data.totalPage)
        updateOriginTotalCount(bookmarkResponse.data.totalCount)
        updateTotalCount(bookmarkResponse.data.totalCount)
        updatePageCount(bookmarkResponse.data.totalPage)
        const bookmark = bookmarkAdapter("remote", bookmarkResponse.data.bookmarks);
        return bookmark

    }

    const getBookmark = async (isLogin: boolean) => {
        try {
            const bookmark = isLogin ? await getDBBookmarks() : getLocalBookmarks()
            //로그인했으면 20개가 오는데 비로그인이면 20개가 아니라 그냥 다 넣는다.
            if(isLogin){
                setFirstPage(bookmark)
            } else {
                setFirstPage(setLocalPagenation(bookmark, 20)[0])
            }
            
            setOriginBookmarks(bookmark);
            setLocalBookmarkPage(setLocalPagenation(bookmark, 20))
            createBookmarkView(setLocalPagenation(bookmark, 20), currentPageNum - 1)
            setLoad(false);
            return ;
        } catch (error) {
            console.log(error)
        }

    };


    const bookmarkRefresh = () => {
        setCurrentSearch(CurrentSearch.Bookmark) 
        setBookmarkView(firstPage) 
        
        setCurrentTag([]) 
        updateOriginPageCount(originPageCount) 
        updateOriginTotalCount(originTotalCount) 
        setCurrentPageNum(1) 
        currentPageRefresh(1)
        if (isLogin) {
            updatePageCount(originPageCount)
            updateTotalCount(originTotalCount)
        }
        else {
            setLocalBookmarkPage(setLocalPagenation(originBookmarks, 20))
            updatePageCount(Math.ceil(originBookmarks.length/20))
            updateTotalCount(originBookmarks.length)
        }
    };

    const bookmarkCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        useModal.openModal();
    };
    const saveNewBookmarkStorage = (newBookmarkData: Bookmark | Bookmark[]) => {
       if (!isLogin) {
            secureStorage.removeItem('local-bookmark-storage')
            secureStorage.setItem('local-bookmark-storage', JSON.stringify(newBookmarkData))
        }
    };

    const updateOriginBookmark = (bookmarks: Bookmark[]) => {
        setOriginBookmarks(bookmarks)
    }
    const bookmarkSequence = (newBookmarks: Bookmark[]) => {
        updateOriginBookmark(newBookmarks)
        saveNewBookmarkStorage(newBookmarks)
        updateBookmarkView(newBookmarks)
    }

    // 북마크 생성
    const sendCreateBookmark = async (newBookmarkData: CreateBookmarkData) => {
        try {
            const encrypted = secureWrap.encryptWrapper('test')
            const bookmarks = await customAxios.post(`/bookmark`, {
                ...newBookmarkData
            })
            return bookmarks
        } catch (error) {
            console.log(error)
        }
    }
    const setNewBookmark = async (createBookmarkData: CreateBookmarkData) => {
        const lastId = originBookmarks[0].id
        const id = lastId + 1;
        const url = createBookmarkData.url 
        const tags = createBookmarkData.tagNames.map((tagName, i) => {
            return { id: 'tempTag' + i, tag: tagName }
        })
        let createdResp;
        if (isLogin) {
            const saveResp = await sendCreateBookmark({ url, tagNames: createBookmarkData.tagNames })
            const bookmarkResponse = await customAxios.get(`/bookmark?pageNo=${currentPageNum}`)
            createdResp = bookmarkResponse.data
            console.log(bookmarkResponse.data)
        }
        let newBookmarkArr: Bookmark[] = [{ id, url, tags }]
        const decrypted = originBookmarks.map((bookmark) => {
            const url = secureWrap.decryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })
        newBookmarkArr.push(...decrypted);
        newBookmarkArr.pop();
        if(createdResp){
            newBookmarkArr = [...createdResp.bookmarks]
        }   
        const encryptedArr = newBookmarkArr.map((bookmark) => {
            const url = secureWrap.encryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })
        setFirstPage(newBookmarkArr)
        bookmarkSequence(newBookmarkArr)
        setLocalBookmarkPage(setLocalPagenation(encryptedArr, 20))
        
        createBookmarkView(setLocalPagenation(encryptedArr, 20), currentPageNum - 1)
        updateTotalCount(createdResp? createdResp.totalCount : newBookmarkArr.length)
        updatePageCount(createdResp? createdResp.totalPage : Math.ceil(newBookmarkArr.length/20))
    };

    const getMachedIndex = (targetBookmarkId: any) => {
        let isMachedIndex: any;
        const targetId = Number(targetBookmarkId)
        const length = originBookmarks.length;

        for (let i = 0; i < length; i++) {
            if (originBookmarks[i].id === targetId) {
                isMachedIndex = i
                break;
            }
        }
        return isMachedIndex
    }

    // 북마크 제거
    const sendDeleteBookmark = async (bookmarkId: any) => {
        try {
            const boookmarks = await customAxios.delete(`/bookmark/${bookmarkId}`)
        } catch (error) {
            console.log(error)
        }
    }
    const onBookmarkDelete = async (targetBookmarkId: any) => {
        let deletedResp; //{totalCount, totalPage, bookmarks}
        if (isLogin) {
            await sendDeleteBookmark(targetBookmarkId)
            const bookmarkResponse = await customAxios.get(`/bookmark?pageNo=${currentPageNum}`)
            console.log(bookmarkResponse.data)
            deletedResp = bookmarkResponse.data;
        }
        else {

        }
        const length = originBookmarks.length;
        const isMachedIndex = getMachedIndex(targetBookmarkId)
        const decrypted = originBookmarks.map((bookmark) => {
            const url = secureWrap.decryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })
        const deletedBookmark = deletedResp? deletedResp.bookmarks: [...decrypted.slice(0, isMachedIndex), ...decrypted.slice(isMachedIndex + 1, length)]
        //오리진이랑 퍼스트랑 역할이 겹친다. 정돈하자
        setFirstPage(deletedBookmark)
        bookmarkSequence(deletedBookmark)

        setLocalBookmarkPage(setLocalPagenation(deletedBookmark, 20))
        updateBookmarkView(setLocalPagenation(deletedBookmark, 20)[currentPageNum - 1])
        
        updateTotalCount(deletedResp? deletedResp.totalCount : deletedBookmark.length)
        updatePageCount(deletedResp? deletedResp.totalPage : Math.ceil(deletedBookmark.length/20))
       
    }

    //북마크 수정
    const editForm = (booomarkId: any, originBookmark: Bookmark, editContent: Bookmark) => {
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

        const editedBookmark: Bookmark[] = [...decrypted.slice(0, isMachedIndex), { id: targetBookmarkId, url: url, tags: tags }, ...decrypted.slice(isMachedIndex + 1, length)]

        const encryptedArr = editedBookmark.map((bookmark) => {
            const url = secureWrap.encryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })

        bookmarkSequence(editedBookmark)
        setLocalBookmarkPage(setLocalPagenation(encryptedArr, 20))
        createBookmarkView(setLocalPagenation(encryptedArr, 20), currentPageNum - 1)
    }

    const pagenationNum = async (num: number) => {
        
        if (isLogin) {
            if (currentSearch === CurrentSearch.Bookmark) {
                const bookmarks = await customAxios.get(`/bookmark?pageNo=${num}`)
                setCurrentSearch(CurrentSearch.Bookmark)
                setOriginBookmarks(bookmarks.data.bookmarks);
                setLocalBookmarkPage(setLocalPagenation(bookmarks.data.bookmarks, 20))
                updateBookmarkView(bookmarks.data.bookmarks)
            }
            if (currentSearch === CurrentSearch.TagSearch) {
                const andSearch = await customAxios.get(`/tag/search-and?tags=${currentTag.join('+')}&pageNo=${num}`)
                setCurrentSearch(CurrentSearch.TagSearch)
                setOriginBookmarks(andSearch.data.bookmarks);
                setLocalBookmarkPage(setLocalPagenation(andSearch.data.bookmarks, 20))
                updateBookmarkView(andSearch.data.bookmarks)
            }
            if (currentSearch === CurrentSearch.SideBarSearch) {
                const orSearch = await customAxios.get(`/tag/search-or?tags=${currentTag.join('+')}&pageNo=${num}`)
                setCurrentSearch(CurrentSearch.SideBarSearch)
                setOriginBookmarks(orSearch.data.bookmarks);
                setLocalBookmarkPage(setLocalPagenation(orSearch.data.bookmarks, 20))
                updateBookmarkView(orSearch.data.bookmarks)
            }
            setCurrentPageNum(num)
            currentPageRefresh(num)
        }
        else {
            console.log(localBookmarkPage)
            updateBookmarkView(localBookmarkPage[num-1]) 
            setCurrentPageNum(num)
            currentPageRefresh(num)
        }

    }
    
    const paginationCount = () => {
        if (isLogin) {
            return pageCount
        }
        return localBookmarkPage.length
    }

    const syncBookmark = async () => {
        setLoad(true)
        const localBookmarks = secure().local().getItem('local-bookmark-storage')
        if(!localBookmarks) {
            setLoad(false)
            return ;
        }
        const dbBookmarkCount = await customAxios.get(`/bookmark/count`) 

         if(dbBookmarkCount.data.count <= 0) {
            const localBookmarkArr = bookmarkAdapter("local", localBookmarks);
            const localTagNamesSet = new Set();
            for(let localBookmark of localBookmarkArr) {
                const tags = localBookmark.tags;
                if(tags.length <= 0) {
                    continue;
                }
                for(let tag of tags) {
                    localTagNamesSet.add(tag.tag)
                }
            }
            const localTagNamesArr = Array.from(localTagNamesSet)
            const syncBookmarkBody = {
                bookmarks: localBookmarkArr,
                tagNames: localTagNamesArr
            }
            const syncBookmark = await customAxios.post(`/bookmark/sync`,
                syncBookmarkBody
            )
            console.log(syncBookmark)
        }
        setLoad(false)
    }
    useEffect(() => {
        if (!isLogin && !secure().local().getItem('local-bookmark-storage')) {
            secure().local().setItem('local-bookmark-storage', JSON.stringify(dumyBookmark))
        }
        getBookmark(isLogin)
    }, [])
    useEffect(() => {
        if(isLogin){
            syncBookmark()
        }
    }, [])
   
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

    const Loading = () => {
        return (
            <LoadingBar />
        )
    }

    const MainContent = () => {
        return (
        <BookmarkContainer id='main-content'>
            <Helmet>TagMark | TAG-MARK</Helmet>
            <SideBar getTagBookmarkSideBar={getTagBookmarkSideBar} originBookmarks={originBookmarks} isLogin={props.isLogin} />
            <div></div>
            <BookmarkManageContainer>
                <ContentBox>
                <BookmarkManagebuttonContainer>
                    <div>총 {totalCount}개 북마크</div>
                    <ManageButtonContainer>
                        <CommonButton onClick={bookmarkRefresh}>
                            새로고침
                        </CommonButton>
                        <CommonButton onClick={bookmarkCreate}>
                            북마크생성
                        </CommonButton>
                    </ManageButtonContainer>
                </BookmarkManagebuttonContainer>
                {useModal.isShowModal ? <BookmarkCreateBlock useModal={useModal} setNewBookmark={setNewBookmark} /> : null}
                <TagText>{currentTag[0]?.length > 0 ? <div>{currentTag.join(', ')}</div> : <div>&nbsp;</div>}</TagText>
                <Bookmarks bookmarkView={bookmarkView} getTagBookmark={getTagBookmark} onBookmarkDelete={onBookmarkDelete} editSave={editSave} />
                </ContentBox>
                <PageMove count={paginationCount()} pagenationNum={pagenationNum} currentPageNum={currentPageNum} />
            </BookmarkManageContainer>
        </BookmarkContainer>
        )
    }
    return (
        load ? <Loading/> : <MainContent/>
    )
};