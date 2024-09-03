// src/state/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
import globalReducer from "./index"; // Assuming this exports your global slice
import { loadState, saveState } from "./localStorageUtils";

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  preloadedState, // Use preloadedState to initialize the store with persisted state
});

store.subscribe(() => {
  saveState({
    global: store.getState().global,
  });
});

setupListeners(store.dispatch);

export default store;
