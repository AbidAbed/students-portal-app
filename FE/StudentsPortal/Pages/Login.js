import useBackButtonHandler from '../Hooks/useBackButtonHandler';
import useLoginPageConfig from '../Hooks/useLoginPageConfig';
import Form from '../Components/Form';
import {
  addPath,
  changeIsLoggedIn,
  changePath,
  changeRole,
  usePostAuthMutation,
  usePostLoginMutation,
} from '../Store/StoreInterface';

import {useDispatch} from 'react-redux';

import {useEffect, useState} from 'react';
function Login() {
  const handleBackButton = useBackButtonHandler();
  handleBackButton();

  const dispatch = useDispatch();

  const [postLogin, postLoginResponse] = usePostLoginMutation();

  const [postAuth, postAuthResponse] = usePostAuthMutation();

  const [loginError, setLoginError] = useState('');

  function onLoginSubmit(loginData) {
    postLogin(loginData);
  }

  useEffect(() => {
    if (!postLoginResponse.isLoading || !postLoginResponse.isUninitialized) {
      if (postLoginResponse.isError) {
        setLoginError('Invalid email or password ');
      } else {
        setLoginError('');
        postAuth();
      }
    }
  }, [postLoginResponse]);

  useEffect(() => {
    if (!postAuthResponse.isLoading && !postAuthResponse.isUninitialized) {
      if (postAuthResponse.isError) {
      } else {
        dispatch(changeIsLoggedIn(true));
        dispatch(changeRole(postAuthResponse.data.role));
        dispatch(changePath('/home'));
        dispatch(addPath('/home'));
      }
    }
  }, [postAuthResponse]);
  return (
    <Form
      config={useLoginPageConfig()}
      onSubmit={onLoginSubmit}
      submitButtonTitle="Login"
      responseError={loginError}
      setResponseError={setLoginError}
      doValidation={true}
    />
  );
}
export default Login;
