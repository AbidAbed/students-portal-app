import {createSlice} from '@reduxjs/toolkit';

const ChatSlice = createSlice({
  name: 'Chat',
  initialState: {},
  reducers: {
    fetchChatPeople(state, action) {
      console.log(Object.keys(state).length)
      if (Object.keys(state).length === 0) {
        // console.log('state', state);
        const chatObj = action.payload.reduce((prevChOb, curChOb) => {
          return {
            ...prevChOb,
            [curChOb.id]: {chat: [], username: curChOb.username},
          };
        }, {});
        return {...chatObj};
      } else {
        const updatedState = Object.entries(state).filter(usrChat => {
          const foundUsr = action.payload.find(usrC => {
            // console.log(6666,usrC.id,usrChat[0],usrChat[0] === usrC.id)
            return Number(usrC.id) === Number(usrChat[0])
          });
          // console.log(6666,foundUsr)
          // console.log(6666,foundUsr)
          if (foundUsr) return false;
          else return true;
        });
        // console.log(8888,updatedState)
        if (updatedState.length === 0) {
          return {...state};
        } else {
          const cleanedState = updatedState.reduce((prevVal, curVal) => {
            return {
              ...prevVal,
              [curVal[0]]: {
                username: curVal[1].username,
                chat: [],
              },
            };
          }, {});
          return {...state, ...cleanedState};
        }
      }
    },
    addChatToUser(state, action) {
      const [user] = Object.entries(state).filter(usr => {
        return Number(usr[0]) === Number(action.payload.user_id);
      });
      const userObj = {
        id: user[0],
        username: user[1].username,
        chat: user[1].chat,
      };
      console.log(55, userObj, action.payload);
      console.log('state', {
        ...state,
      });

      if (userObj.chat.length !== 0) {
        const removedDubChat = userObj.chat.reduce((prevChtObj, currChtObj) => {
          const foundChtObj = action.payload.chat.find(
            cht =>
              currChtObj.id === cht.id &&
              currChtObj.msg === cht.msg &&
              currChtObj.time === cht.time,
          );

          if (!foundChtObj) {
            return [...prevChtObj, currChtObj];
          }
          return [...prevChtObj, currChtObj];
        }, []);
        console.log('dub removed ', removedDubChat);
        return {
          ...state,
          [userObj.id]: {username: userObj.username, chat: [...removedDubChat]},
        };
      } else {
        console.log('test', {
          ...state,
          [userObj.id]: {
            username: userObj.username,
            chat: [...action.payload.chat],
          },
        });
        return {
          ...state,
          [userObj.id]: {
            username: userObj.username,
            chat: [...action.payload.chat],
          },
        };
      }
      // console.log(10, removedDubChat);
    },
  },
});
export default ChatSlice;
export const {fetchChatPeople, addChatToUser} = ChatSlice.actions;
