import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'User',
  initialState: {},
  reducers: {
    fetchUserData(state, action) {
      return {...action.payload};
    },
  },
});
export default userSlice;
export const {fetchUserData} = userSlice.actions;
