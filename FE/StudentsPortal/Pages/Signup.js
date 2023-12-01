import useBackButtonHandler from '../Hooks/useBackButtonHandler';
import useSignupPageConfig from '../Hooks/useSignupPageConfig';
import Form from '../Components/Form';
import {
  addPath,
  changePath,
  usePostSignupMutation,
} from '../Store/StoreInterface';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

function Signup() {
  const handleBackButton = useBackButtonHandler();
  handleBackButton();

  const dispatch = useDispatch();

  const [postSignup, postSignupResponse] = usePostSignupMutation();

  const [signupError, setSginupError] = useState('');

  function onSignupSubmit(signupData) {
    const {repPassword, ...rest} = signupData;
    postSignup(rest);
  }

  useEffect(() => {
    if (!postSignupResponse.isLoading && !postSignupResponse.isUninitialized) {
      if (postSignupResponse.isError) {
        setSginupError('Check your info , error occured');
      } else {
        setSginupError('');
        dispatch(changePath('/login'));
        dispatch(addPath('login'));
      }
    }
  }, [postSignupResponse]);
  return (
    <Form
      config={useSignupPageConfig()}
      onSubmit={onSignupSubmit}
      submitButtonTitle="Signup"
      responseError={signupError}
      setResponseError={setSginupError}
      doValidation={true}
    />
  );
}
export default Signup;
