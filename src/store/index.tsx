import { configureStore } from "@reduxjs/toolkit";
import bookmarkSlice from "./slices/bookmarkSlice";
import currentSlice from "./slices/currentSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
  reducer: {
    bookmark: bookmarkSlice.reducer,
    user: userSlice.reducer,
    current: currentSlice.reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;