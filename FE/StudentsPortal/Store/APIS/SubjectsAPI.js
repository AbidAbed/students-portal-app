import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
const SubjectApi = createApi({
  reducerPath: 'SubjectApi',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.0.17:3000'}),
  endpoints: builder => ({
    postCreateSubject: builder.mutation({
      query: subjectData => {
        return {
          method: 'POST',
          credentials: 'include',
          body: {name: subjectData.name, passmark: subjectData.passmark},
          url: '/subjects',
        };
      },
    }),
    getAllSubjects: builder.query({
      query: page => {
        return {
          method: 'GET',
          credentials: 'include',
          params: {page: page},
          url: '/subjects',
        };
      },
    }),
    postAssignSubject: builder.mutation({
      query: userSubjectIds => {
        return {
          method: 'POST',
          url: '/subject/assign',
          credentials: 'include',
          body: {...userSubjectIds},
        };
      },
    }),
    deleteSubjectFromUser: builder.mutation({
      query: userSubjectData => {
        return {
          method: 'DELETE',
          url: '/subject/assign',
          body: {...userSubjectData},
          credentials: 'include',
        };
      },
    }),
    postUserMark: builder.mutation({
      query: userMarkData => {
        return {
          method: 'POST',
          credentials: 'include',
          body: {...userMarkData},
          url: '/subject/mark',
        };
      },
    }),
  }),
});
export default SubjectApi;
export const {
  usePostCreateSubjectMutation,
  useGetAllSubjectsQuery,
  usePostAssignSubjectMutation,
  useDeleteSubjectFromUserMutation,
  usePostUserMarkMutation,
} = SubjectApi;
