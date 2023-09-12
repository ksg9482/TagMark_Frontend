import { useCallback, useEffect, useState } from "react";
import { defaultBookmark } from "../../../defaultBookmark/defaultBookmark";
import { Bookmark, CreateBookmarkData, CurrentSearch, FindType } from "../../../interface/bookmark";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import { deepCopy, secure } from "../../../utils";
import { customAxios } from "../../../utils/axios/customAxios";
import Bookmarks from "../../blocks/bookmark/Bookmarks";
import { PageMove } from "../../blocks/bookmark/pageMove/PageMove";
import SideBar from "../../blocks/sidebar/Sidebar";
import { BookmarkCreateBlock } from "../../blocks/bookmark/BookmarkCreateBlock";
import { BookmarkContainer, BookmarkManagebuttonContainer, BookmarkManageContainer, CommonButton, ContentBox, DisableCommonButton, ManageButtonContainer, TagText } from "./styles";
import { LoadingBar } from "../../blocks/common/loading/loading";
import { Helmet } from "react-helmet-async";
import { AlramModalPage } from "../modal/AlramModalPage";






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
    const UseCreate = () => {
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
    const useModal = UseModal();
    const useCreate = UseCreate();

    const bookmarkInitData: Bookmark = {
        id: 'init',
        url: '',
        tags: [{
            id: 'init',
            tag: ''
        }]
    }

    const [originBookmarks, setOriginBookmarks] = useState([bookmarkInitData]);
    const [originPageCount, setOriginPageCount] = useState(0);
    const [originTotalCount, setOriginTotalCount] = useState(0);
    const [bookmarkView, setBookmarkView] = useState([bookmarkInitData]);
    const [localBookmarkPage, setLocalBookmarkPage] = useState([[bookmarkInitData]]);
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [currentTag, setCurrentTag] = useState(['']);
    const [totalCount, setTotalCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentSearch, setCurrentSearch] = useState(CurrentSearch.Bookmark);

    const [firstPage, setFirstPage] = useState([bookmarkInitData])

    const [errorMessage, setErrorMessage] = useState('')

    const [load, setLoad] = useState(true);

    const updateErrorMessage = (message: string) => {
        setErrorMessage(message)
    };

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

        const andSearch = await customAxios.get(`/bookmark/search-and?tags=${blankChange}&pageNo=1`)

        if (andSearch.data.bookmarks.length <= 0) {
            return bookmarkView
        }

        return andSearch.data
    }
    const getRemoteTagBookmarkSideBar = async (targetTags: string[]) => {
        currentPageRefresh(1)
        const orSearch = await customAxios.get(`/bookmark/search-or?tags=${targetTags}&pageNo=1`)

        if (orSearch.data.bookmarks.length <= 0) {
            return bookmarkView
        }

        return orSearch.data
    }
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
            updatePageCount(Math.ceil(bookmarkFilter.length / 20))
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
            updatePageCount(Math.ceil(bookmarkFilter.length / 20))
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

    // 북마크 읽기
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
        const bookmark = isLogin ? await getDBBookmarks() : getLocalBookmarks()

        if (isLogin) {
            setFirstPage(bookmark)
        } else {
            setFirstPage(setLocalPagenation(bookmark, 20)[0])
        }

        setOriginBookmarks(bookmark);
        setLocalBookmarkPage(setLocalPagenation(bookmark, 20))
        createBookmarkView(setLocalPagenation(bookmark, 20), currentPageNum - 1)
        return;
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
            updatePageCount(Math.ceil(originBookmarks.length / 20))
            updateTotalCount(originBookmarks.length)
        }
    };

    const bookmarkCreate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        useCreate.openModal();
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
            const bookmarks = await customAxios.post(`/bookmark`, {
                ...newBookmarkData
            })
            if (!bookmarks.data.success && bookmarks.data.message) {
                throw new Error('이미 존재하는 북마크 입니다.')
            }
            return bookmarks
        } catch (error: any) {
            updateErrorMessage(error.message)
            useModal.openModal();
        }
    }
    const setNewBookmark = async (createBookmarkData: CreateBookmarkData) => {
        if (!isLogin && totalCount >= 100) {
            return;
        }
        const lastId = originBookmarks[0].id
        const id = lastId + 1;
        const url = createBookmarkData.url
        const tags = createBookmarkData.tagNames.map((tagName, i) => {
            return { id: 'tempTag' + i, tag: tagName }
        })
        let createdResp;
        if (isLogin) {
            await sendCreateBookmark({ url, tagNames: createBookmarkData.tagNames })
            const bookmarkResponse = await customAxios.get(`/bookmark?pageNo=${currentPageNum}`)
            createdResp = bookmarkResponse.data
        }
        let newBookmarkArr: Bookmark[] = [{ id, url, tags }]
        const decrypted = originBookmarks.map((bookmark) => {
            const url = secureWrap.decryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })

        newBookmarkArr.push(...decrypted);
        if (createdResp) {
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
        updateTotalCount(createdResp ? createdResp.totalCount : newBookmarkArr.length)
        updatePageCount(createdResp ? createdResp.totalPage : Math.ceil(newBookmarkArr.length / 20))

        useCreate.closeModal()
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
            const bookmarks = await customAxios.delete(`/bookmark/${bookmarkId}`)
            if (!bookmarks.data.success) {
                throw new Error('북마크 삭제에 실패했습니다.')
            }
        } catch (error: any) {
            updateErrorMessage(error.message)
            useModal.openModal();
        }
    }
    const onBookmarkDelete = async (targetBookmarkId: any) => {
        let deletedResp;
        if (isLogin) {
            await sendDeleteBookmark(targetBookmarkId)
            const bookmarkResponse = await customAxios.get(`/bookmark?pageNo=${currentPageNum}`)
            deletedResp = bookmarkResponse.data;
        }
        const length = originBookmarks.length;
        const isMachedIndex = getMachedIndex(targetBookmarkId)
        const decrypted = originBookmarks.map((bookmark) => {
            const url = secureWrap.decryptWrapper(bookmark.url)
            return { ...bookmark, url: url }
        })
        const deletedBookmark = deletedResp ? deletedResp.bookmarks : [...decrypted.slice(0, isMachedIndex), ...decrypted.slice(isMachedIndex + 1, length)]

        setFirstPage(deletedBookmark)
        bookmarkSequence(deletedBookmark)

        setLocalBookmarkPage(setLocalPagenation(deletedBookmark, 20))
        updateBookmarkView(setLocalPagenation(deletedBookmark, 20)[currentPageNum - 1])

        updateTotalCount(deletedResp ? deletedResp.totalCount : deletedBookmark.length)
        updatePageCount(deletedResp ? deletedResp.totalPage : Math.ceil(deletedBookmark.length / 20))

    }

    // 북마크 수정
    const editForm = (originBookmark: Bookmark, editContent: Bookmark) => {
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
            if (!editResult.data.success) {
                throw new Error('북마크 수정에 실패했습니다.')
            }
        } catch (error: any) {
            updateErrorMessage(error.message)
            useModal.openModal();
        }
    }
    const editSave = (targetBookmarkId: any, originBookmark: any, editContent: any) => {
        const url = editContent.url
        const tags = editContent.tags.map((tag: any, i: number) => {
            return { id: 'tempTag' + i, tag: tag.tag }
        })
        if (isLogin) {

            const editFrom = editForm(originBookmark, editContent)
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
                const andSearch = await customAxios.get(`/bookmark/search-and?tags=${currentTag.join('+')}&pageNo=${num}`)
                setCurrentSearch(CurrentSearch.TagSearch)
                setOriginBookmarks(andSearch.data.bookmarks);
                setLocalBookmarkPage(setLocalPagenation(andSearch.data.bookmarks, 20))
                updateBookmarkView(andSearch.data.bookmarks)
            }
            if (currentSearch === CurrentSearch.SideBarSearch) {
                const orSearch = await customAxios.get(`/bookmark/search-or?tags=${currentTag.join('+')}&pageNo=${num}`)
                setCurrentSearch(CurrentSearch.SideBarSearch)
                setOriginBookmarks(orSearch.data.bookmarks);
                setLocalBookmarkPage(setLocalPagenation(orSearch.data.bookmarks, 20))
                updateBookmarkView(orSearch.data.bookmarks)
            }
            setCurrentPageNum(num)
            currentPageRefresh(num)
        }
        else {
            updateBookmarkView(localBookmarkPage[num - 1])
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
        const localBookmarks = secure().local().getItem('local-bookmark-storage')
        if (!localBookmarks) {
            setLoad(false)
            return;
        }
        const dbBookmarkCount = await customAxios.get(`/bookmark/count`)

        if (dbBookmarkCount.data.count <= 0) {
            const localBookmarkArr = bookmarkAdapter("local", localBookmarks);
            const localTagNamesSet = new Set();
            for (let localBookmark of localBookmarkArr) {
                const tags = localBookmark.tags;
                if (tags.length <= 0) {
                    continue;
                }
                for (let tag of tags) {
                    localTagNamesSet.add(tag.tag)
                }
            }
            const localTagNamesArr = Array.from(localTagNamesSet)
            const syncBookmarkBody = {
                bookmarks: localBookmarkArr.map(localBookmark => {
                    return { ...localBookmark, url: secureWrap.decryptWrapper(localBookmark.url) }
                }),
                tagNames: localTagNamesArr
            }
            await customAxios.post(`/bookmark/sync`,
                syncBookmarkBody
            );
            // eslint-disable-next-line no-restricted-globals
            location.reload()
        }
    }
    const startsequence = async () => {
        setLoad(true);
        if (isLogin) {
            await syncBookmark();
        }
        await getBookmark(isLogin);
        setLoad(false);
    }
    useEffect(() => {
        if (!isLogin && !secure().local().getItem('local-bookmark-storage')) {
            secure().local().setItem('local-bookmark-storage', JSON.stringify(defaultBookmark))
        }
        startsequence()
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
                {useModal.isShowModal ? <AlramModalPage useModal={useModal} errorMessage={errorMessage} /> : null}
                <SideBar getTagBookmarkSideBar={getTagBookmarkSideBar} originBookmarks={originBookmarks} isLogin={props.isLogin} />
                <div></div>
                <BookmarkManageContainer>
                    <ContentBox>
                        <BookmarkManagebuttonContainer>
                            <div></div>
                            <ManageButtonContainer>
                                <CommonButton onClick={bookmarkRefresh}>
                                    새로고침
                                </CommonButton>
                                {!isLogin && totalCount >= 100
                                    ? <DisableCommonButton disabled>
                                        <div id="bookmark-count" data-tooltip-content="로그인하시면 북마크를 무제한으로 이용하실 수 있습니다.">
                                            <div>북마크생성</div>
                                            <Tooltip anchorId="bookmark-count" variant="info" />
                                        </div>
                                    </DisableCommonButton>
                                    : <CommonButton onClick={bookmarkCreate}>
                                        <div>북마크생성</div>
                                    </CommonButton>
                                }
                            </ManageButtonContainer>
                        </BookmarkManagebuttonContainer>
                        {useCreate.isShowModal ? <BookmarkCreateBlock useCreate={useCreate} setNewBookmark={setNewBookmark} /> : null}
                        <TagText>{currentTag[0]?.length > 0 ? <div>{currentTag.join(', ')}</div> : <div>&nbsp;</div>}</TagText>
                        <Bookmarks bookmarkView={bookmarkView} getTagBookmark={getTagBookmark} onBookmarkDelete={onBookmarkDelete} editSave={editSave} />
                    </ContentBox>
                    <PageMove count={paginationCount()} pagenationNum={pagenationNum} currentPageNum={currentPageNum} />
                </BookmarkManageContainer>
            </BookmarkContainer>
        )
    }
    return (
        load ? <Loading /> : <MainContent />
    )
};

