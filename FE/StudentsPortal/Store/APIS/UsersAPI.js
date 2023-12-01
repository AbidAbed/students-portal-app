import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

const UsersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.17:3000'}),
  endpoints: builder => ({
    getAllUsers: builder.query({
      query: page => {
        return {
          method: 'GET',
          params: {page},
          credentials: 'include',
          url: '/users',
        };
      },
    }),
    deleteUser: builder.mutation({
      query: id => {
        return {
          method: 'DELETE',
          credentials: 'include',
          url: '/user',
          body: {id: id},
        };
      },
    }),
    putUser: builder.mutation({
      query: user => {
        return {
          method: 'PUT',
          body: {...user},
          credentials: 'include',
          url: '/user',
        };
      },
    }),
    postCreatUser: builder.mutation({
      query: createdUserData => {
        return {
          method: 'POST',
          url: '/admin/user',
          credentials: 'include',
          body: {
            email: createdUserData.email,
            password: createdUserData.password,
            isActivated: createdUserData.isActivated,
            username: createdUserData.username,
          },
        };
      },
    }),
    getUserInfo: builder.query({
      query: () => {
        return {
          method: 'GET',
          credentials: 'include',
          url: '/user',
        };
      },
    }),
  }),
});

export default UsersApi;
export const {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  usePutUserMutation,
  usePostCreatUserMutation,
  useGetUserInfoQuery,
} = UsersApi;
