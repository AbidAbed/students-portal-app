import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
const ChatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.17:3000'}),
  endpoints: builder => ({
    getChatPeople: builder.query({
      query: data => {
        return {
          method: 'GET',
          credentials: 'include',
          url: '/users/chat',
          params: {...data},
        };
      },
    }),
    getChatUser: builder.mutation({
      query: (info) => {
        return {
          method: 'GET',
          credentials: 'include',
          url: '/user/chat',
          params: {...info},
        };
      },
    }),
  }),
});

export default ChatApi;
export const {useGetChatPeopleQuery, useGetChatUserMutation} = ChatApi;
