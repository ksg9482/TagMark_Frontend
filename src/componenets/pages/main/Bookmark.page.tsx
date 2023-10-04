import { useCallback, useEffect, useState } from "react";
import { defaultBookmark } from "../../../defaultBookmark/defaultBookmark";
import {
  Bookmark,
  CreateBookmarkData,
  CurrentSearch,
  FindType,
} from "../../../interface/bookmark";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { deepCopy, secure } from "../../../utils";
import { customAxios } from "../../../utils/axios/customAxios";
import Bookmarks from "../../blocks/bookmark/Bookmarks";
import { PageMove } from "../../blocks/bookmark/pageMove/PageMove";
import SideBar from "../../blocks/sidebar/Sidebar";
import { BookmarkCreateBlock } from "../../blocks/bookmark/BookmarkCreateBlock";
import {
  BookmarkContainer,
  BookmarkManagebuttonContainer,
  BookmarkManageContainer,
  CommonButton,
  ContentBox,
  DisableCommonButton,
  ManageButtonContainer,
  TagText,
} from "./styles";
import { LoadingBar } from "../../blocks/common/loading/loading";
import { Helmet } from "react-helmet-async";
import { AlramModalPage } from "../modal/AlramModalPage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { 
  updateBookmarks, 
  updatePageCount as newUpdatePageCount, 
  updateTotalCount as newUpdateTotalCount, 
  updateOriginBookmarks, 
  updateOriginPageCount, 
  updateOriginTotalCount,
  updateBookmarkView,
  updateFirstPage,
  updateLocalBookmarkPage
} from "../../../store/slices/bookmarkSlice";
import { 
  updateCurrentPageNum,
  updateCurrentTag as newUpdateCurrentTag,
  updateCurrentSearch, 
} from "../../../store/slices/currentSlice";

export const BookMark = (props: any) => {
  const dispach = useDispatch();
  const isLogin = useSelector((state: RootState) => {
    return state.user.islogin
  });
  const newOriginBookmarks = useSelector((state: RootState) => {
    return state.bookmark.originBookmarks;
  });
  const newOriginPageCount = useSelector((state: RootState) => {
    return state.bookmark.originPageCount;
  });
  const newOriginTotalCount = useSelector((state: RootState) => {
    return state.bookmark.originTotalCount;
  });
  const newPageCount = useSelector((state: RootState) => {
    return state.bookmark.pageCount;
  });
  const newTotalCount = useSelector((state: RootState) => {
    return state.bookmark.totalCount;
  });
  const newCurrentPageNum = useSelector((state: RootState) => {
    return state.current.currentPageNum;
  });
  const newCurrentTag = useSelector((state: RootState) => {
    return state.current.currentTag;
  });
  const newCurrentSearch = useSelector((state: RootState) => {
    return state.current.currentSearch;
  });
  const newBookmarkView = useSelector((state: RootState) => {
    return state.bookmark.bookmarkView;
  });
  const newFirshPage = useSelector((state: RootState) => {
    return state.bookmark.firstPage;
  });
  const newLocalBookmarkPage = useSelector((state: RootState) => {
    return state.bookmark.localBookmarkPage;
  });
  const originBookmarkHandle = {
    updateOriginBookmarks:(bookmarks: Bookmark[])=>{
        dispach(updateOriginBookmarks(bookmarks))
        return bookmarks;
    },
    updateOriginPageCount:(count: number)=>{
      dispach(updateOriginPageCount(count))
      return count;
    },
    updateOriginTotalCount:(count: number)=>{
      dispach(updateOriginTotalCount(count))
      return count;
    },
  };
  const bookmarkHandle = {
    updateBookmarks:(bookmarks: Bookmark[])=>{
        dispach(updateBookmarks(bookmarks))
        return bookmarks;
    },
    updatePageCount:(count: number)=>{
      dispach(newUpdatePageCount(count))
      return count;
    },
    updateTotalCount:(count: number)=>{
      dispach(newUpdateTotalCount(count))
      return count;
    },
    updateBookmarkView:(bookmarkView: Bookmark[])=>{
      dispach(updateBookmarkView(bookmarkView))
      return bookmarkView;
    },
    updateFirstPage:(firstPage: Bookmark[])=>{
      dispach(updateFirstPage(firstPage))
      return firstPage;
    },
    updateLocalBookmarkPage:(firstPage: Bookmark[][])=>{
      dispach(updateLocalBookmarkPage(firstPage))
      return firstPage;
    },
  };
  const currentHandle = {
    updateCurrentPageNum:(pagenum: number)=>{
        dispach(updateCurrentPageNum(pagenum))
        return pagenum;
    },
    newUpdateCurrentTag:(tags: string[])=>{
      dispach(newUpdateCurrentTag(tags))
      return tags;
    },
    updateCurrentSearch:(currentSearch: CurrentSearch)=>{
      dispach(updateCurrentSearch(currentSearch))
      return currentSearch;
    },
  };
  const secureStorage = secure().local();
  const secureWrap = secure().wrapper();
  const UseModal = () => {
    const [isShowModal, setIsShowModal] = useState(false);

    const openModal = useCallback(() => {
      setIsShowModal(true);
    }, [setIsShowModal]);

    const closeModal = useCallback(() => {
      setIsShowModal(false);
    }, [setIsShowModal]);

    const toggleModal = useCallback(() => {
      setIsShowModal((prev) => !prev);
    }, [setIsShowModal]);

    return { isShowModal, openModal, closeModal, toggleModal };
  };
  const UseCreate = () => {
    const [isShowModal, setIsShowModal] = useState(false);

    const openModal = useCallback(() => {
      setIsShowModal(true);
    }, [setIsShowModal]);

    const closeModal = useCallback(() => {
      setIsShowModal(false);
    }, [setIsShowModal]);

    const toggleModal = useCallback(() => {
      setIsShowModal((prev) => !prev);
    }, [setIsShowModal]);

    return { isShowModal, openModal, closeModal, toggleModal };
  };
  const useModal = UseModal();
  const useCreate = UseCreate();

  const bookmarkInitData: Bookmark = {
    id: "init",
    url: "",
    tags: [
      {
        id: "init",
        tag: "",
      },
    ],
  };


  const [errorMessage, setErrorMessage] = useState("");

  const [load, setLoad] = useState(true);

  const updateErrorMessage = (message: string) => {
    setErrorMessage(message);
  };

  const updateCurrentTag = (targetTag: any) => {
    if (newCurrentTag.includes(targetTag)) {
      return;
    }
    if (!newCurrentTag[0]) {
      currentHandle.newUpdateCurrentTag([targetTag]);
    } else {
      currentHandle.newUpdateCurrentTag([...newCurrentTag, targetTag]);
    }
  };
  const updateCurrentTagSideBar = (targetTag: any) => {
    currentHandle.newUpdateCurrentTag([targetTag]);
  };
  const getRemoteTagBookmark = async (targetTags: string[]) => {
    currentPageRefresh(1);
    const prevTag: any[] = newCurrentTag;
    if (newCurrentTag[0] !== "" && !newCurrentTag.includes(targetTags[0])) {
      targetTags.push(...prevTag);
    }
    if (newCurrentTag.includes(targetTags[0])) {
      targetTags = prevTag;
    }

    const blankChange = targetTags.map((tag) => {
      return tag.replaceAll(" ", "%20");
    });

    const andSearch = await customAxios.get(
      `/bookmark/search-and?tags=${blankChange}&pageNo=1`
    );

    if (andSearch.data.bookmarks.length <= 0) {
      return newBookmarkView;
    }

    return andSearch.data;
  };
  const getRemoteTagBookmarkSideBar = async (targetTags: string[]) => {
    currentPageRefresh(1);
    const orSearch = await customAxios.get(
      `/bookmark/search-or?tags=${targetTags}&pageNo=1`
    );

    if (orSearch.data.bookmarks.length <= 0) {
      return newBookmarkView;
    }

    return orSearch.data;
  };
  const getTagBookmark = async (targetTags: string[], findType: FindType) => {
    currentPageRefresh(1);
    if (!newCurrentTag.includes(targetTags[0])) {
      updateCurrentTag(targetTags.join());
    }

    let searched: Bookmark[];
    if (isLogin) {
      const result = await getRemoteTagBookmark(targetTags);
      searched = result.bookmarks;
      bookmarkHandle.updateBookmarkView(searched);
      bookmarkHandle.updateTotalCount(result.totalCount);
      bookmarkHandle.updatePageCount(result.totalPage);
    } else {
      const prevTag: any[] = newCurrentTag;
      if (newCurrentTag[0] !== "" && !newCurrentTag.includes(targetTags[0])) {
        targetTags.push(...prevTag);
      }
      if (newCurrentTag.includes(targetTags[0])) {
        targetTags = prevTag;
      }

      const bookmarkArr: Bookmark[] = findType === "origin" ? newOriginBookmarks : newBookmarkView;
      console.log(newOriginBookmarks)
      console.log(newBookmarkView)
      const prevBookmark = bookmarkArr.map((bookmark) => {
        const tags = bookmark.tags ? bookmark.tags : [];
        return { ...bookmark, tags: tags };
      });

      const bookmarkFilter = prevBookmark.filter((bookmark) => {
        return targetTags.every((tagStr) => {
          return bookmark.tags.some((tag) => {
            return tag.tag === tagStr;
          });
        });
      });

      searched = bookmarkFilter;
      bookmarkHandle.updateBookmarkView(setLocalPagenation(searched, 20)[0]);
      bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(searched, 20));
      bookmarkHandle.updateTotalCount(bookmarkFilter.length);
      bookmarkHandle.updatePageCount(Math.ceil(bookmarkFilter.length / 20));
    }

    currentHandle.updateCurrentSearch(CurrentSearch.TagSearch);
    currentHandle.updateCurrentPageNum(1);
  };

  const getTagBookmarkSideBar = async (
    targetTags: string[],
    findType: FindType
  ) => {
    let searched: Bookmark[];
    currentPageRefresh(1);
    if (isLogin) {
      const result = await getRemoteTagBookmarkSideBar(targetTags);
      searched = result.bookmarks;

      bookmarkHandle.updateTotalCount(result.totalCount);
      bookmarkHandle.updatePageCount(result.totalPage);
    } else {
      const bookmarkArr: Bookmark[] =
        findType === "origin" ? newOriginBookmarks : newBookmarkView;
      const tempBookmark = bookmarkArr.map((bookmark) => {
        const tags = bookmark.tags ? bookmark.tags : [];
        return { ...bookmark, tags: tags };
      });
      const bookmarkFilter = tempBookmark.filter((bookmark) => {
        const tagFilter = bookmark.tags.filter((tag: any) => {
          return targetTags.includes(tag.tag);
        });
        if (1 <= tagFilter.length) return tagFilter;
      });
      searched = bookmarkFilter;
      bookmarkHandle.updateTotalCount(bookmarkFilter.length);
      bookmarkHandle.updatePageCount(Math.ceil(bookmarkFilter.length / 20));
    }
    currentHandle.updateCurrentSearch(CurrentSearch.SideBarSearch);
    updateCurrentTagSideBar(targetTags.join());

    bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(searched, 20));
    createBookmarkView(setLocalPagenation(searched, 20), newCurrentPageNum - 1);
    bookmarkHandle.updateBookmarkView(searched);
    currentHandle.updateCurrentPageNum(1);
  };

  const bookmarkAdapter = (
    storageType: "local" | "remote",
    bookmarks: any
  ): Bookmark[] => {
    const localToBookmarkForm = (bookmarks: string) => {
      const jsonParsedData = JSON.parse(bookmarks);
      const encrypted = jsonParsedData.map((bookmark: Bookmark) => {
        return { ...bookmark, url: secureWrap.encryptWrapper(bookmark.url) };
      });
      if (!jsonParsedData) {
        return [bookmarkInitData];
      }
      return encrypted;
    };
    const remoteToBookmarkForm = (bookmarks: Bookmark[]) => {
      const data = bookmarks;
      const encrypted = data.map((bookmark: Bookmark) => {
        return { ...bookmark, url: secureWrap.encryptWrapper(bookmark.url) };
      });
      return encrypted;
    };
    if (storageType === "local") {
      return localToBookmarkForm(bookmarks);
    } else {
      return remoteToBookmarkForm(bookmarks);
    }
  };
  const setLocalPagenation = (bookmark: Bookmark[], pageCount: number) => {
    const copy = deepCopy(bookmark);
    const length = bookmark.length;
    const cnt =
      Math.floor(length / pageCount) +
      (Math.floor(length % pageCount) > 0 ? 1 : 0);
    const result: Bookmark[][] = [];
    for (let i = 0; i < cnt; i++) {
      result.push(copy.splice(0, pageCount));
    }
    return result;
  };

  const createBookmarkView = (
    pagenationBookmark: Bookmark[][],
    targetPage: number
  ) => {
    bookmarkHandle.updateBookmarkView(pagenationBookmark[targetPage] || []);
  };


  // 북마크 읽기
  const getLocalBookmarks = () => {
    const localBookmarks = secure().local().getItem("local-bookmark-storage")!;
    const bookmark = bookmarkAdapter("local", localBookmarks);
    bookmarkHandle.updateTotalCount(bookmark.length);
    return bookmark;
  };

  const getDBBookmarks = async () => {
    const currentPageCount = sessionStorage.getItem("current-page") || 1;
    const bookmarkResponse = await customAxios.get(
      `/bookmark?pageNo=${currentPageCount}`
    );
    if (bookmarkResponse.data.bookmarks.length <= 0) {
      return newBookmarkView;
    }

    updateOriginPageCount(bookmarkResponse.data.totalPage);
    updateOriginTotalCount(bookmarkResponse.data.totalCount);
    bookmarkHandle.updateTotalCount(bookmarkResponse.data.totalCount);
    bookmarkHandle.updatePageCount(bookmarkResponse.data.totalPage);
    const bookmark = bookmarkAdapter("remote", bookmarkResponse.data.bookmarks);
    return bookmark;
  };

  const getBookmark = async (isLogin: boolean) => {
    const bookmark = isLogin ? await getDBBookmarks() : getLocalBookmarks();

    if (isLogin) {
      bookmarkHandle.updateFirstPage(bookmark);
    } else {
      bookmarkHandle.updateFirstPage(setLocalPagenation(bookmark, 20)[0]);
    }

    originBookmarkHandle.updateOriginBookmarks(bookmark);
    bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(bookmark, 20));
    createBookmarkView(setLocalPagenation(bookmark, 20), newCurrentPageNum - 1);
    return;
  };

  const bookmarkRefresh = () => {
    currentHandle.updateCurrentSearch(CurrentSearch.Bookmark);
    bookmarkHandle.updateBookmarkView(newFirshPage);

    currentHandle.newUpdateCurrentTag([]);
    originBookmarkHandle.updateOriginPageCount(newOriginPageCount)
    originBookmarkHandle.updateOriginTotalCount(newOriginTotalCount)
    currentHandle.updateCurrentPageNum(1);
    currentPageRefresh(1);
    if (isLogin) {
      bookmarkHandle.updatePageCount(newOriginPageCount);
      bookmarkHandle.updateTotalCount(newOriginTotalCount);
    } else {
      console.log(newOriginBookmarks)
      bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(newOriginBookmarks, 20));
      bookmarkHandle.updatePageCount(Math.ceil(newOriginBookmarks.length / 20));
      bookmarkHandle.updateTotalCount(newOriginBookmarks.length);
    }
  };

  const bookmarkCreate = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    useCreate.openModal();
  };
  const saveNewBookmarkStorage = (newBookmarkData: Bookmark | Bookmark[]) => {
    if (!isLogin) {
      secureStorage.removeItem("local-bookmark-storage");
      secureStorage.setItem(
        "local-bookmark-storage",
        JSON.stringify(newBookmarkData)
      );
    }
  };

  const updateOriginBookmark = (bookmarks: Bookmark[]) => {
    originBookmarkHandle.updateOriginBookmarks(bookmarks);
  };
  const bookmarkSequence = (newBookmarks: Bookmark[]) => {
    updateOriginBookmark(newBookmarks);
    saveNewBookmarkStorage(newBookmarks);
    bookmarkHandle.updateBookmarkView(newBookmarks);
  };

  // 북마크 생성
  const sendCreateBookmark = async (newBookmarkData: CreateBookmarkData) => {
    try {
      const bookmarks = await customAxios.post(`/bookmark`, {
        ...newBookmarkData,
      });
      if (!bookmarks.data.success && bookmarks.data.message) {
        throw new Error("이미 존재하는 북마크 입니다.");
      }
      return bookmarks;
    } catch (error: any) {
      updateErrorMessage(error.message);
      useModal.openModal();
    }
  };
  const setNewBookmark = async (createBookmarkData: CreateBookmarkData) => {
    if (!isLogin && newTotalCount >= 100) {
      return;
    }
    const lastId = newOriginBookmarks[0]?.id || 1;
    const id = lastId + 1;
    const url = createBookmarkData.url;
    const tags = createBookmarkData.tagNames.map((tagName, i) => {
      return { id: "tempTag" + i, tag: tagName };
    });
    let createdResp;
    if (isLogin) {
      await sendCreateBookmark({ url, tagNames: createBookmarkData.tagNames });
      const bookmarkResponse = await customAxios.get(
        `/bookmark?pageNo=${newCurrentPageNum}`
      );
      createdResp = bookmarkResponse.data;
    }
    let newBookmarkArr: Bookmark[] = [{ id, url, tags }];
    const decrypted = newOriginBookmarks.map((bookmark) => {
      const url = secureWrap.decryptWrapper(bookmark.url);
      return { ...bookmark, url: url };
    });

    newBookmarkArr.push(...decrypted);
    if (createdResp) {
      newBookmarkArr = [...createdResp.bookmarks];
    }
    const encryptedArr = newBookmarkArr.map((bookmark) => {
      const url = secureWrap.encryptWrapper(bookmark.url);
      return { ...bookmark, url: url };
    });
    bookmarkHandle.updateFirstPage(newBookmarkArr);
    bookmarkSequence(newBookmarkArr);
    bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(encryptedArr, 20));

    createBookmarkView(
      setLocalPagenation(encryptedArr, 20),
      newCurrentPageNum - 1
    );
    bookmarkHandle.updateTotalCount(
      createdResp ? createdResp.totalCount : newBookmarkArr.length
    );
    bookmarkHandle.updatePageCount(
      createdResp
        ? createdResp.totalPage
        : Math.ceil(newBookmarkArr.length / 20)
    );

    useCreate.closeModal();
  };

  const getMachedIndex = (targetBookmarkId: any) => {
    let isMachedIndex: any;
    const targetId = Number(targetBookmarkId);
    const length = newOriginBookmarks.length;

    for (let i = 0; i < length; i++) {
      if (newOriginBookmarks[i].id === targetId) {
        isMachedIndex = i;
        break;
      }
    }
    return isMachedIndex;
  };

  // 북마크 제거
  const sendDeleteBookmark = async (bookmarkId: any) => {
    try {
      const bookmarks = await customAxios.delete(`/bookmark/${bookmarkId}`);
      if (!bookmarks.data.success) {
        throw new Error("북마크 삭제에 실패했습니다.");
      }
    } catch (error: any) {
      updateErrorMessage(error.message);
      useModal.openModal();
    }
  };
  const onBookmarkDelete = async (targetBookmarkId: any) => {
    let deletedResp;
    if (isLogin) {
      await sendDeleteBookmark(targetBookmarkId);
      const bookmarkResponse = await customAxios.get(
        `/bookmark?pageNo=${newCurrentPageNum}`
      );
      deletedResp = bookmarkResponse.data;
    }
    const length = newOriginBookmarks.length;
    const isMachedIndex = getMachedIndex(targetBookmarkId);
    const decrypted = newOriginBookmarks.map((bookmark) => {
      const url = secureWrap.decryptWrapper(bookmark.url);
      return { ...bookmark, url: url };
    });
    const deletedBookmark = deletedResp
      ? deletedResp.bookmarks
      : [
          ...decrypted.slice(0, isMachedIndex),
          ...decrypted.slice(isMachedIndex + 1, length),
        ];

    bookmarkHandle.updateFirstPage(deletedBookmark);
    bookmarkSequence(deletedBookmark);

    bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(deletedBookmark, 20));
    bookmarkHandle.updateBookmarkView(
      setLocalPagenation(deletedBookmark, 20)[newCurrentPageNum - 1]
    );

    bookmarkHandle.updateTotalCount(
      deletedResp ? deletedResp.totalCount : deletedBookmark.length
    );
    bookmarkHandle.updatePageCount(
      deletedResp
        ? deletedResp.totalPage
        : Math.ceil(deletedBookmark.length / 20)
    );
  };

  // 북마크 수정
  const editForm = (originBookmark: Bookmark, editContent: Bookmark) => {
    const decrypytedOrigin = {
      ...originBookmark,
      url: secureWrap.decryptWrapper(originBookmark.url),
    };
    const decrypytedEdit = {
      ...editContent,
      url: secureWrap.decryptWrapper(editContent.url),
    };
    let changeForm: any = {};

    const addTag = decrypytedEdit.tags.filter((editTag) => {
      return !decrypytedOrigin.tags.some((originTag) => {
        return originTag.tag === editTag.tag;
      });
    });

    const deleteTag = decrypytedOrigin.tags.filter((originTag) => {
      return !decrypytedEdit.tags.some((editTag) => {
        return originTag.tag === editTag.tag;
      });
    });

    if (decrypytedOrigin.url !== decrypytedEdit.url) {
      changeForm.url = decrypytedEdit.url;
    }
    if (addTag.length > 0) {
      changeForm.addTag = addTag.map((tag) => {
        return tag.tag;
      });
    }
    if (deleteTag.length > 0) {
      changeForm.deleteTag = deleteTag.map((tag) => {
        return tag.id;
      });
    }

    return changeForm;
  };
  const sendEditBookmark = async (targetBookmarkId: any, editContent: any) => {
    try {
      const editResult = await customAxios.patch(
        `/bookmark/${targetBookmarkId}`,
        { ...editContent }
      );
      if (!editResult.data.success) {
        throw new Error("북마크 수정에 실패했습니다.");
      }
    } catch (error: any) {
      updateErrorMessage(error.message);
      useModal.openModal();
    }
  };
  const editSave = (
    targetBookmarkId: any,
    originBookmark: any,
    editContent: any
  ) => {
    const url = editContent.url;
    const tags = editContent.tags.map((tag: any, i: number) => {
      return { id: "tempTag" + i, tag: tag.tag };
    });
    if (isLogin) {
      const editFrom = editForm(originBookmark, editContent);
      sendEditBookmark(targetBookmarkId, editFrom);
    }
    const length = newOriginBookmarks.length;
    const isMachedIndex = getMachedIndex(targetBookmarkId);
    const decrypted = newOriginBookmarks.map((bookmark) => {
      return { ...bookmark, url: secureWrap.decryptWrapper(bookmark.url) };
    });

    const editedBookmark: Bookmark[] = [
      ...decrypted.slice(0, isMachedIndex),
      { id: targetBookmarkId, url: url, tags: tags },
      ...decrypted.slice(isMachedIndex + 1, length),
    ];

    const encryptedArr = editedBookmark.map((bookmark) => {
      const url = secureWrap.encryptWrapper(bookmark.url);
      return { ...bookmark, url: url };
    });

    bookmarkSequence(editedBookmark);
    bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(encryptedArr, 20));
    createBookmarkView(
      setLocalPagenation(encryptedArr, 20),
      newCurrentPageNum - 1
    );
  };

  const pagenationNum = async (num: number) => {
    if (isLogin) {
      if (newCurrentSearch === CurrentSearch.Bookmark) {
        const bookmarks = await customAxios.get(`/bookmark?pageNo=${num}`);
        currentHandle.updateCurrentSearch(CurrentSearch.Bookmark);
        originBookmarkHandle.updateOriginBookmarks(bookmarks.data.bookmarks);
        bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(bookmarks.data.bookmarks, 20));
        bookmarkHandle.updateBookmarkView(bookmarks.data.bookmarks);
      }
      if (newCurrentSearch === CurrentSearch.TagSearch) {
        const andSearch = await customAxios.get(
          `/bookmark/search-and?tags=${newCurrentTag.join("+")}&pageNo=${num}`
        );
        currentHandle.updateCurrentSearch(CurrentSearch.TagSearch);
        originBookmarkHandle.updateOriginBookmarks(andSearch.data.bookmarks);
        bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(andSearch.data.bookmarks, 20));
        bookmarkHandle.updateBookmarkView(andSearch.data.bookmarks);
      }
      if (newCurrentSearch === CurrentSearch.SideBarSearch) {
        const orSearch = await customAxios.get(
          `/bookmark/search-or?tags=${newCurrentTag.join("+")}&pageNo=${num}`
        );
        currentHandle.updateCurrentSearch(CurrentSearch.SideBarSearch);
        originBookmarkHandle.updateOriginBookmarks(orSearch.data.bookmarks);
        bookmarkHandle.updateLocalBookmarkPage(setLocalPagenation(orSearch.data.bookmarks, 20));
        bookmarkHandle.updateBookmarkView(orSearch.data.bookmarks);
      }
      currentHandle.updateCurrentPageNum(num);
      currentPageRefresh(num);
    } else {
      bookmarkHandle.updateBookmarkView(newLocalBookmarkPage[num - 1]);
      currentHandle.updateCurrentPageNum(num);
      currentPageRefresh(num);
    }
  };

  const paginationCount = () => {
    if (isLogin) {
      return newPageCount;
    }
    return newLocalBookmarkPage.length;
  };

  const syncBookmark = async () => {
    const localBookmarks = secure().local().getItem("local-bookmark-storage");
    if (!localBookmarks) {
      setLoad(false);
      return;
    }
    const dbBookmarkCount = await customAxios.get(`/bookmark/count`);

    if (dbBookmarkCount.data.count <= 0) {
      const localBookmarkArr = bookmarkAdapter("local", localBookmarks);
      const localTagNamesSet = new Set();
      for (let localBookmark of localBookmarkArr) {
        const tags = localBookmark.tags;
        if (tags.length <= 0) {
          continue;
        }
        for (let tag of tags) {
          localTagNamesSet.add(tag.tag);
        }
      }
      const localTagNamesArr = Array.from(localTagNamesSet);
      const syncBookmarkBody = {
        bookmarks: localBookmarkArr.map((localBookmark) => {
          return {
            ...localBookmark,
            url: secureWrap.decryptWrapper(localBookmark.url),
          };
        }),
        tagNames: localTagNamesArr,
      };
      await customAxios.post(`/bookmark/sync`, syncBookmarkBody);
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    }
  };
  const startsequence = async () => {
    setLoad(true);
    if (isLogin) {
      await syncBookmark();
    }
    await getBookmark(isLogin);
    setLoad(false);
  };
  useEffect(() => {
    if (!isLogin && !secure().local().getItem("local-bookmark-storage")) {
      secure()
        .local()
        .setItem("local-bookmark-storage", JSON.stringify(defaultBookmark));
    }
    startsequence();
  }, []);

  const currentPageRefresh = (currentPage: number) => {
    window.sessionStorage.removeItem("current-page");
    window.sessionStorage.setItem("current-page", String(currentPage));
  };

  useEffect(() => {
    const isPage = Number(window.sessionStorage.getItem("current-page"));
    if (isPage) {
      currentHandle.updateCurrentPageNum(isPage);
    } else {
      window.sessionStorage.setItem("current-page", String(newCurrentPageNum));
    }
  }, []);

  const Loading = () => {
    return <LoadingBar />;
  };

  const MainContent = () => {
    return (
      <BookmarkContainer id="main-content">
        <Helmet>TagMark | TAG-MARK</Helmet>
        {useModal.isShowModal ? (
          <AlramModalPage useModal={useModal} errorMessage={errorMessage} />
        ) : null}
        <SideBar
          getTagBookmarkSideBar={getTagBookmarkSideBar}
        />
        <div></div>
        <BookmarkManageContainer>
          <ContentBox>
            <BookmarkManagebuttonContainer>
              <div></div>
              <ManageButtonContainer>
                <CommonButton onClick={bookmarkRefresh}>초기화</CommonButton>
                {!isLogin && newTotalCount >= 100 ? (
                  <DisableCommonButton disabled>
                    <div
                      id="bookmark-count"
                      data-tooltip-content="로그인하시면 북마크를 무제한으로 이용하실 수 있습니다."
                    >
                      <div>북마크생성</div>
                      <Tooltip anchorId="bookmark-count" variant="info" />
                    </div>
                  </DisableCommonButton>
                ) : (
                  <CommonButton onClick={bookmarkCreate}>
                    <div>북마크생성</div>
                  </CommonButton>
                )}
              </ManageButtonContainer>
            </BookmarkManagebuttonContainer>
            {useCreate.isShowModal ? (
              <BookmarkCreateBlock
                useCreate={useCreate}
                setNewBookmark={setNewBookmark}
              />
            ) : null}
            <TagText>
              {newCurrentTag[0]?.length > 0 ? (
                <div>{newCurrentTag.join(", ")}</div>
              ) : (
                <div>&nbsp;</div>
              )}
            </TagText>
            <Bookmarks
              getTagBookmark={getTagBookmark}
              onBookmarkDelete={onBookmarkDelete}
              editSave={editSave}
            />
          </ContentBox>
          <PageMove
            count={paginationCount()}
            pagenationNum={pagenationNum}
          />
        </BookmarkManageContainer>
      </BookmarkContainer>
    );
  };
  return load ? <Loading /> : <MainContent />;
};
