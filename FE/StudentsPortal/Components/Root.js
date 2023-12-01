import useNavigator from '../Hooks/useNavigator';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addPath,
  changeIsLoggedIn,
  changeIsUserRegistered,
  changePath,
  changeRole,
  fetchUserData,
  socket,
  usePostAuthMutation,
} from '../Store/StoreInterface';
function Root() {
  const [postAuth, postAuthResponse] = usePostAuthMutation();

  const isUserRegistered = useSelector(state => state.config.isUserRegistered);
  const isLoggedIn = useSelector(state => state.config.isLoggedIn);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const path = useSelector(state => {
    return state.config.path;
  });

  useEffect(() => {
    postAuth();
  }, [path]);

  useEffect(() => {
    if (!postAuthResponse.isLoading && !postAuthResponse.isUninitialized) {
      if (postAuthResponse.isError) {
        dispatch(changeIsLoggedIn(false));
        dispatch(fetchUserData({}));
        if (socket.connected) socket.disconnect();
      } else {
        dispatch(changeIsLoggedIn(true));
        if (postAuthResponse.data.role === 'student') {
          dispatch(changeRole(postAuthResponse.data.role));
          dispatch(fetchUserData({...postAuthResponse.data}));
        } else {
          dispatch(changeRole(postAuthResponse.data.role));
          dispatch(fetchUserData({id: postAuthResponse.data.id}));
        }
        if (path === '/login' || path === '/dashboard') {
          dispatch(changePath('/home'));
          dispatch(addPath('/home'));
        }
      }
    }
  }, [postAuthResponse]);

  useEffect(() => {
    if (user.id !== undefined && !isUserRegistered && isLoggedIn) {
      console.log(user);
      socket.emit('regUserId', user.id);
      dispatch(changeIsUserRegistered(true));
    }
  }, [user]);
  return useNavigator();
}

export default Root;
