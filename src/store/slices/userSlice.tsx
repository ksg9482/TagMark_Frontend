import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  id: string;
  islogin:boolean;
  email:string;
  nickName:string;
  type: string;
  bookmarkCount: number; 
  tagCount: number; 
};

const initialState: InitialState = {
  id: '0',
  islogin:false,
  email:'',
  nickName:'',
  type: 'BASIC',
  bookmarkCount: 0,
  tagCount: 0,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    isLogin: (state, action)=>{
      state.islogin = action.payload;
    },
    updateId: (state, action)=>{
      state.id = action.payload;
    },
    updateEmail: (state, action)=>{
      state.email = action.payload;
    },
    updateNickname: (state, action)=>{
      state.nickName = action.payload;
    },
    updateType: (state, action)=>{
      state.type = action.payload;
    },
    updateBookmarkCount: (state, action)=>{
      state.bookmarkCount = action.payload;
    },
    updateTagCount: (state, action)=>{
      state.tagCount = action.payload;
    },
    
  },
});

export default userSlice;
export const { 
  isLogin,
  updateId,
  updateEmail,
  updateNickname,
  updateType,
  updateBookmarkCount,
  updateTagCount 
} = userSlice.actions;