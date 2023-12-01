import {createSlice} from '@reduxjs/toolkit';
const UsersSlice = createSlice({
  name: 'Users',
  initialState: [],
  reducers: {
    addUsers(state, action) {
      const mergedUsers = action.payload.filter(incomingUser => {
        // Check if incomingUser.id is not present in state
        return state.every(user => user.id !== incomingUser.id);
      });
      return [...state, ...mergedUsers];
    },
    fetchUsers(state, action) {
      return [...action.payload];
    },
    deleteUser(state, action) {
      const users = state.filter(user => {
        return user.id !== action.payload; // Return the result of the comparison
      });

      return users; // Return the new array
    },
    updateUser(state, action) {
      const updatedUsers = state.map(usr => {
        if (usr.id === action.payload.id) {
          return {...usr, ...action.payload};
        } else return usr;
      });
      return updatedUsers;
    },
    addSubjectsToUser(state, action) {
      const updatedUsers = state.map(usr => {
        if (usr.id === action.payload.user_id) {
          if (usr.subjects.find(sub => sub.id === action.payload.subject_id)) {
            return usr;
          } else {
            const updatedUsr = {...usr};
            updatedUsr.subjects = [
              ...updatedUsr.subjects,
              {id: action.payload.subject_id, mark: 0},
            ];
            return updatedUsr;
          }
        } else {
          return usr;
        }
      });
      return [...updatedUsers];
    },
    removeSubjectFromUser(state, action) {
      const updatedUsers = state.map(usr => {
        if (usr.id === action.payload.user_id) {
          const updatedUsrSubs = usr.subjects.filter(
            sub => sub.id !== action.payload.subject_id,
          );
          return {...usr, subjects: updatedUsrSubs};
        } else return usr;
      });
      return [...updatedUsers];
    },
    changeUserMark(state, action) {
      const [user] = state.filter(usr => usr.id === action.payload.user_id);
      console.log(user.subjects);
      const updatedSubjects = user.subjects.map(subject => {
        const updatedSubject = action.payload.subjects.find(
          subj => subj.id === subject.id,
        );
        if (updatedSubject) {
          return updatedSubject;
        } else {
          return subject;
        }
      });
      const updatedUser = {...user, subjects: updatedSubjects};
      const updatedUsers = state.filter(usr => usr.id !== updatedUser.id);
      return [...updatedUsers, updatedUser]; // Fix typo here: return updatedUser, not updateUser
    },
  },
});
export default UsersSlice;
export const {
  addUsers,
  fetchUsers,
  deleteUser,
  updateUser,
  addSubjectsToUser,
  removeSubjectFromUser,
  changeUserMark,
} = UsersSlice.actions;
