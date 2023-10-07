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
  localBookmarkPage: Bookmark[][];
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
  localBookmarkPage: [[bookmarkInitData]],
};
const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    //prev가 더 정확할지도?
    updateOriginBookmarks: (state, action) => {
      state.originBookmarks = action.payload;
    },
    updateOriginPageCount: (state, action) => {
      state.originPageCount = action.payload;
    },
    updateOriginTotalCount: (state, action) => {
      state.originTotalCount = action.payload;
    },
    updateBookmarks: (state, action) => {
      state.bookmarks = action.payload;
    },
    updatePageCount: (state, action) => {
      state.pageCount = action.payload;
    },
    updateTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    updateBookmarkView: (state, action) => {
      if (!action.payload || action.payload.length <= 0) {
        action.payload = [];
      }
      state.bookmarkView = action.payload;
    },
    updateLocalBookmarkPage: (state, action) => {
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
  updateLocalBookmarkPage,
} = bookmarkSlice.actions;
