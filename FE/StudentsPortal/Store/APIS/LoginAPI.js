import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
const LoginAPI = createApi({
  reducerPath: 'LoginAPI',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.17:3000'}),
  endpoints: builder => ({
    postLogin: builder.mutation({
      query: data => {
        return {
          url: '/login',
          method: 'POST',
          body: data,
        };
      },
    }),
    postAuth: builder.mutation({
      query: () => {
        return {
          method: 'POST',
          credentials: 'include',
          url: '/auth',
        };
      },
    }),
    postLogout: builder.mutation({
      query: () => {
        return {
          method: 'POST',
          credentials: 'include',
          url: '/logout',
        };
      },
    }),
  }),
});

export default LoginAPI;

export const {
  usePostLoginMutation,
  usePostAuthMutation,
  usePostLogoutMutation,
} = LoginAPI;
