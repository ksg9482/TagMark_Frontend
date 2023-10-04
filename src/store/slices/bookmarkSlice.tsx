import { createSlice } from "@reduxjs/toolkit";
import { Bookmark } from "../../interface/bookmark";

type InitialState = {
  originBookmarks: Bookmark[];
  originPageCount: number;
  originTotalCount: number;
  bookmarks: Bookmark[];
  pageCount: number;
  totalCount: number;
  bookmarkView: Bookmark[];
  firstPage: Bookmark[];
  localBookmarkPage:Bookmark[][];
};

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

const initialState: InitialState = {
  originBookmarks: [bookmarkInitData],
  originPageCount: 0,
  originTotalCount: 0,
  bookmarks: [bookmarkInitData],
  pageCount: 0,
  totalCount: 0,
  bookmarkView: [bookmarkInitData],
  firstPage: [bookmarkInitData],
  localBookmarkPage:[[bookmarkInitData]]
};
const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    //prev가 더 정확할지도?
    updateOriginBookmarks: (state, action) => {
      console.log(action.payload)
      state.originBookmarks = action.payload;
    },
    updateOriginPageCount: (state, action) => {
      console.log(action.payload)
      state.originPageCount = action.payload;
    },
    updateOriginTotalCount: (state, action) => {
      console.log(action.payload)
      state.originTotalCount = action.payload;
    },
    updateBookmarks: (state, action) => {
      console.log(action.payload)
      state.bookmarks = action.payload;
    },
    updatePageCount: (state, action) => {
      console.log(action.payload)
      state.pageCount = action.payload;
    },
    updateTotalCount: (state, action) => {
      console.log(action.payload)
      state.totalCount = action.payload;
    },
    updateBookmarkView: (state, action) => {
      console.log(action.payload)
      if (!action.payload || action.payload.length <= 0) {
        action.payload = [];
      }
      state.bookmarkView = action.payload;
    },
    updateFirstPage: (state, action) => {
      console.log(action.payload)
      if (!action.payload || action.payload.length <= 0) {
        action.payload = [];
      }
      state.firstPage = action.payload;
    },
    updateLocalBookmarkPage: (state, action) => {
      console.log(action.payload)
      state.localBookmarkPage = action.payload;
    },
  },
});

export default bookmarkSlice;
export const { 
  updateOriginBookmarks,
  updateOriginPageCount,
  updateOriginTotalCount,
  updateBookmarks,
  updatePageCount,
  updateTotalCount,
  updateBookmarkView,
  updateFirstPage,
  updateLocalBookmarkPage
} = bookmarkSlice.actions;