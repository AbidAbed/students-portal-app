import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
const SignupAPI = createApi({
  reducerPath: 'Signup',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.17:3000'}),
  endpoints: builder => ({
    postSignup: builder.mutation({
      query: data => {
        return {url: '/signup', method: 'POST', body: data};
      },
    }),
  }),
});

export default SignupAPI;

export const {usePostSignupMutation} = SignupAPI;
