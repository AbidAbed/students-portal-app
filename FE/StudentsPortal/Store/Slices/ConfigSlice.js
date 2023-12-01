import {createSlice} from '@reduxjs/toolkit';

const configSLice = createSlice({
  name: 'Config',
  initialState: {
    path: '/dashboard',
    pathStack: ['/dashboard'],
    role: 'student',
    isLoggedIn: false,
    selectedUserToChat: {},
    isUserRegistered: false,
  },
  reducers: {
    changePath(state, action) {
      return {...state, path: action.payload};
    },
    addPath(state, action) {
      return {...state, pathStack: [...state.pathStack, action.payload]};
    },
    removePath(state, action) {
      return {
        ...state,
        pathStack: [...state.pathStack.slice(0, state.pathStack.length - 1)],
        path: state.pathStack[state.pathStack.length - 2],
      };
    },
    changeRole(state, action) {
      return {...state, role: action.payload};
    },
    changeIsLoggedIn(state, action) {
      return {...state, isLoggedIn: action.payload};
    },
    changePathStack(state, action) {
      return {...state, pathStack: [...action.payload]};
    },
    changeSelectedUserToChat(state, action) {
      return {...state, selectedUserToChat: action.payload};
    },
    changeIsUserRegistered(state, action) {
      return {...state, isUserRegistered: action.payload};
    },
  },
});
export default configSLice;
export const {
  changePath,
  addPath,
  removePath,
  changeRole,
  changeIsLoggedIn,
  changePathStack,
  changeSelectedUserToChat,
  changeIsUserRegistered,
} = configSLice.actions;
