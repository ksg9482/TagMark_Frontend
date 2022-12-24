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

        //이거 앞에서 미리 처리해야 함
        const blankChange = targetTags.map((tag) => {
            return tag.replaceAll(' ', '%20')
        })

        //띄어쓰기 문제 해결!!
        //사이드바 검색이 우선되게. 같은 로직 공유하니 and로 자동 적용됨
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
        //태그 눌러가면서 원하는거 좁혀가려면?

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

            // const addTag = decrypytedEdit.tags.filter((editTag) => {
            //     return !decrypytedOrigin.tags.some((originTag) => {
            //         return originTag.tag === editTag.tag
            //     })
            // })
            const bookmarkFilter = prevBookmark.filter((bookmark) => {
                return targetTags.every((tagStr) => {
                    return bookmark.tags.some((tag) => {
                        return tag.tag === tagStr
                    })
                })
            })
            // 이걸로 바뀌면 북마크 개수 바꿔야 됨
            // const bookmarkFilter = prevBookmark.filter((bookmark) => {
            //     const tagFilter = bookmark.tags.filter((tag: any) => {
            //         return targetTags.includes(tag.tag)
            //     })
            //     if (1 <= tagFilter.length) return tagFilter
            // })
            searched = bookmarkFilter
            updateBookmarkView(setLocalPagenation(searched, 20)[0])
            setLocalBookmarkPage(setLocalPagenation(searched, 20))
            updateTotalCount(bookmarkFilter.length)
            //이동하면 이거 결과 저장 안됨. 이걸로 재저장해야 한다.
            updatePageCount(Math.ceil(bookmarkFilter.length/20))
        }

        setCurrentSearch(CurrentSearch.TagSearch)
        
        // //해당하는페이지 보여줌
        //createBookmarkView(setLocalPagenation(searched, 20), currentPageNum - 1)
        
        //return setBookmarkView(bookmarkFilter)
        setCurrentPageNum(1)
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
            updateTotalCount(bookmarkFilter.length)
            updatePageCount(Math.ceil(bookmarkFilter.length/20))
        }
        setCurrentSearch(CurrentSearch.SideBarSearch)
        //url 암호화 문제
        updateCurrentTagSideBar(targetTags.join())

        setLocalBookmarkPage(setLocalPagenation(searched, 20))
        // //해당하는페이지 보여줌
        createBookmarkView(setLocalPagenation(searched, 20), currentPageNum - 1)
        //return setBookmarkView(bookmarkFilter)
        updateBookmarkView(searched)
        setCurrentPageNum(1) //지금 몇 페이지에 있는지 페이지 넘버를 1로 새로고침(숫자)
        
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
        return result
    }

    //이거 둘이 정리
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
            
            //원본저장
            setOriginBookmarks(bookmark);
            //페이지네이션 별로 구분
            setLocalBookmarkPage(setLocalPagenation(bookmark, 20))
            // //해당하는페이지 보여줌
            createBookmarkView(setLocalPagenation(bookmark, 20), currentPageNum - 1)
            // return setBookmarkView(bookmark);
            setLoad(false);
        } catch (error) {
            console.log(error)
        }

    };

    //상태 정리 해야 함. 상태가 꼬여있어서 복잡해진거 해결 안됨
    //전체보기를 하면 결국 getBookmark의 첫화면으로 돌아온다
    //첫화면을 따로 저장하는게 좋을까?
    const bookmarkRefresh = () => {
        console.log(firstPage, originBookmarks)
        setCurrentSearch(CurrentSearch.Bookmark) //첫화면 구성요소. 맨처음엔 getBookmark였음
        setBookmarkView(firstPage) //첫화면 구성요소. 맨처음 뷰로 복귀
        //setBookmarkView(setLocalPagenation(originBookmarks, 20)[0]) //페이지네이션 한걸로 해야 함
        setCurrentTag([]) //첫화면 구성요소. 맨처음엔 태그지정 없었음
        updateOriginPageCount(originPageCount) //첫화면 구성요소. 맨처음엔 몇페이지였나
        updateOriginTotalCount(originTotalCount) //첫화면 구성요소. 맨처음엔 총 몇 개 북마크였나
        setCurrentPageNum(1) //지금 몇 페이지에 있는지 페이지 넘버를 1로 새로고침(숫자)
        currentPageRefresh(1) //여러페이지중 첫번째 페이지로 옮김(뷰)
        if (isLogin) {
            updatePageCount(originPageCount)
            updateTotalCount(originTotalCount)
        }
        else {
            setLocalBookmarkPage(setLocalPagenation(originBookmarks, 20))
            updatePageCount(Math.ceil(originBookmarks.length/20))//이건 로그인시라 상관없음
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
            const bookmarks = await customAxios.post(`/bookmark`, {
                ...newBookmarkData
            })
            return bookmarks
        } catch (error) {
            console.log(error)
        }
    }
    const setNewBookmark = async (createBookmarkData: CreateBookmarkData) => {
        //2페이지에서 추가하면 오류발생. 20개 안맞아서 일듯? 마찬가지로 페이지 넘어가는 순간것들 제어필요
        //로컬(로컬에 저장), 리모트(서버 전송, 로컬저장), 공통필요(변동사항을 view에 적용)
        //if로 로그인 상태일때만 서버에 전송하는 과정 추가하는 쪽으로 개발
        const lastId = originBookmarks[0].id
        const id = lastId + 1;
        const url = createBookmarkData.url //암호? 평문? 공백인거 보면 문제가?
        const tags = createBookmarkData.tags.map((tag, i) => {
            return { id: 'tempTag' + i, tag: tag }
        })
        let createdResp;
        if (isLogin) {
            const saveResp = await sendCreateBookmark({ url, tags: createBookmarkData.tags })
            const bookmarkResponse = await customAxios.get(`/bookmark?pageNo=${currentPageNum}`)
            createdResp = bookmarkResponse.data
            console.log(bookmarkResponse.data)
        }
        //태그 중복 방지는?
        //newBookmarkArr.push(...bookmarkView)
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
        // //해당하는페이지 보여줌
        createBookmarkView(setLocalPagenation(encryptedArr, 20), currentPageNum - 1)
        //처리 끝난 데이터를 받아 로컬 혹은 DB저장. view, origin 갱신
        //만들었으면 처음으로 돌아가게 하는게 좋을까?
        //여기서 바로 리프레시 적용하면 생성된거 반영 안된다.
        updateTotalCount(createdResp? createdResp.totalCount : newBookmarkArr.length)
        updatePageCount(createdResp? createdResp.totalPage : Math.ceil(newBookmarkArr.length/20))
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
            //삭제하면 다시 서버에서 가져와서 뿌리기. 갯수만큼만 가져와서 다음게 없음.
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

        //삭제하면 1페이지로 가짐
        setLocalBookmarkPage(setLocalPagenation(deletedBookmark, 20))
        updateBookmarkView(setLocalPagenation(deletedBookmark, 20)[currentPageNum - 1])
        // //해당하는페이지 보여줌
        //처리 끝난 데이터를 받아 로컬 혹은 DB저장. view, origin 갱신
        //만들었으면 처음으로 돌아가게 하는게 좋을까?
        //여기서 바로 리프레시 적용하면 생성된거 반영 안된다.

        updateTotalCount(deletedResp? deletedResp.totalCount : deletedBookmark.length)
        updatePageCount(deletedResp? deletedResp.totalPage : Math.ceil(deletedBookmark.length/20))
        //20개 되는 순간 페이지카운트는 계속 2임. 1되야됨
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
        //암호화되서 옴
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
                const bookmarks = await customAxios.get(`/bookmark?pageNo=${num}`)
                setCurrentSearch(CurrentSearch.Bookmark)
                //오리진 북마크는 처음 만들고 안바꿔야하는거 아닌가?
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
            updateBookmarkView(localBookmarkPage[num-1]) //2번으로 이동은 1번째 배열을 불러와야 함
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

    // useEffect(() => {
    //     if (!isLogin) {
    //         console.log('이게문제?')
    //         createBookmarkView(setLocalPagenation(originBookmarks, 20), currentPageNum - 1)
    //     }
    // }, [originBookmarks, currentPageNum])

    const Loading = () => {
        return (
            <LoadingBar />
        )
    }

    const MainContent = () => {
        return (
        <BookmarkContainer id='main-content'>
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

//로컬에 저장된거 암호화 못시키나? 가져올때 원복시키면 되지 않을까?
//export default BookMark

/**
 * 
 * 로컬은 로직수정 해야함. 
태그 누르면 거의 OR급으로 나옴


생성, 수정 정리
생성은 그냥 띄어쓰기하면 그냥 분리됨
근데 수정은 줄넘김 안하면 하나로 인식. 이 간극 어떻게 줄일까?


암호화방침
set에 적용은 update함수 만들어서. 여기서 일괄적으로 암호화 실시. 다른 함수 내에서 각각 하면 헷갈린다.

useㅇㅇㅇ함수에 return이함수 2개. updateㅇㅇㅇ, getㅇㅇㅇ.
update는 암호화 저장. get은 복호화 반환.
상태하나당 함수가 사실상 여러개 생기지만, 착오없이 할 수 있다.



지우고 새로고침버튼은 오류. 오리진에 적용된걸 뷰에 재적용하다보니 이미 지워졌는데 오리진에선 남아있다.
오리진 쓰는 다른 기능들도 오리진이랑 현재랑 안 맏는거 더 있을수 있다.



firstPage - 맨처음 getBookmark작동했을때 첫페이지. 새로고침시 갱신없이 바로 첫페이지로 돌아가는 용도.
첫페이지에서 삭제, 수정, 생성이 일어나면 갱신.

snapshot - 보고있는 페이지. 삭제, 수정, 생성시 갱신. (예: 태그검색 상태에서 수정하면 보이는화면, 스냅샷 수정. 태그검색을 유지하며 해야 됨)
스프레드로 뿌리고 원하는 거 수정, 로컬저장. 사실상 1페이지일 경우 퍼스트페이지와 같이 다뤄야 한다.
 */