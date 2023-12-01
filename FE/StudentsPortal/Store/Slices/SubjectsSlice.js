import {createSlice} from '@reduxjs/toolkit';
const SubjectsSlice = createSlice({
  name: 'subjects',
  initialState: [],
  reducers: {
    fetchSubjects(state, action) {
      return [...action.payload];
    },
    addSubject(state, action) {
      const mergedSubjects = action.payload.filter(incomingSubject => {
        // Check if incomingUser.id is not present in state
        return state.every(subject => subject.id !== incomingSubject.id);
      });
      return [...state, ...mergedSubjects];
    },
  },
});

export default SubjectsSlice;

export const {fetchSubjects, addSubject} = SubjectsSlice.actions;
