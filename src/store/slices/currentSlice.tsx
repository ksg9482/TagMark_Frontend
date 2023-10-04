import { createSlice } from "@reduxjs/toolkit";
import { CurrentSearch } from "../../interface/bookmark";

type InitialState = {
  currentPageNum: number;
  currentTag: string[];
  currentSearch: CurrentSearch;
};

const initialState: InitialState = {
  currentPageNum: 1,
  currentTag: [""],
  currentSearch: CurrentSearch.Bookmark,
};
const currentSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateCurrentPageNum: (state, action)=>{
      state.currentPageNum = action.payload;
    },
    updateCurrentTag: (state, action)=>{
      state.currentTag = action.payload;
    },
    updateCurrentSearch: (state, action)=>{
      state.currentSearch = action.payload;
    },
  },
});

export default currentSlice;
export const { 
  updateCurrentPageNum,
  updateCurrentTag,
  updateCurrentSearch
} = currentSlice.actions;