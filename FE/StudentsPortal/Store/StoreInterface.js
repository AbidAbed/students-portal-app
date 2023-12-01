import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import userSlice from './Slices/UserSlice';
import configSLice from './Slices/ConfigSlice';
import {
  changePath,
  addPath,
  removePath,
  changeRole,
  changeIsLoggedIn,
  changePathStack,
  changeSelectedUserToChat,
  changeIsUserRegistered,
} from './Slices/ConfigSlice';

import LoginAPI from './APIS/LoginAPI';

import SignupAPI from './APIS/SignupAPI';

import {usePostSignupMutation} from './APIS/SignupAPI';

import UsersApi from './APIS/UsersAPI';
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  usePutUserMutation,
  usePostCreatUserMutation,
  useGetUserInfoQuery,
} from './APIS/UsersAPI';

import SubjectApi from './APIS/SubjectsAPI';
import {
  usePostCreateSubjectMutation,
  useGetAllSubjectsQuery,
  usePostAssignSubjectMutation,
  useDeleteSubjectFromUserMutation,
  usePostUserMarkMutation,
} from './APIS/SubjectsAPI';
import {
  usePostLoginMutation,
  usePostAuthMutation,
  usePostLogoutMutation,
} from './APIS/LoginAPI';
import UsersSlice from './Slices/UsersSlice';
import ChatApi from './APIS/ChatAPI';
import {useGetChatPeopleQuery, useGetChatUserMutation} from './APIS/ChatAPI';
import {
  addUsers,
  fetchUsers,
  deleteUser,
  updateUser,
  addSubjectsToUser,
  removeSubjectFromUser,
  changeUserMark,
} from './Slices/UsersSlice';

import {fetchUserData} from './Slices/UserSlice';
import {fetchSubjects, addSubject} from './Slices/SubjectsSlice';
import SubjectsSlice from './Slices/SubjectsSlice';
import ChatSlice from './Slices/ChatSlice';
import {fetchChatPeople, addChatToUser} from './Slices/ChatSlice';

import {io} from 'socket.io-client';
const socket = io.connect('http://192.168.0.17:4000');

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    config: configSLice.reducer,
    users: UsersSlice.reducer,
    subjects: SubjectsSlice.reducer,
    chat: ChatSlice.reducer,
    [SignupAPI.reducerPath]: SignupAPI.reducer,
    [LoginAPI.reducerPath]: LoginAPI.reducer,
    [UsersApi.reducerPath]: UsersApi.reducer,
    [SubjectApi.reducerPath]: SubjectApi.reducer,
    [ChatApi.reducerPath]: ChatApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(LoginAPI.middleware)
      .concat(SignupAPI.middleware)
      .concat(UsersApi.middleware)
      .concat(SubjectApi.middleware)
      .concat(ChatApi.middleware),
});
setupListeners(store.dispatch);
export {
  store,
  changePath,
  addPath,
  removePath,
  changeRole,
  changeIsLoggedIn,
  changePathStack,
  addUsers,
  fetchUsers,
  deleteUser,
  updateUser,
  fetchSubjects,
  addSubject,
  addSubjectsToUser,
  removeSubjectFromUser,
  changeUserMark,
  fetchUserData,
  fetchChatPeople,
  socket,
  changeSelectedUserToChat,
  addChatToUser,
  changeIsUserRegistered,
  usePostAuthMutation,
  usePostLoginMutation,
  usePostSignupMutation,
  usePostLogoutMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  usePutUserMutation,
  usePostCreatUserMutation,
  usePostCreateSubjectMutation,
  useGetAllSubjectsQuery,
  usePostAssignSubjectMutation,
  useDeleteSubjectFromUserMutation,
  usePostUserMarkMutation,
  useGetUserInfoQuery,
  useGetChatPeopleQuery,
  useGetChatUserMutation,
};
