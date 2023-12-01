import {useDispatch, useSelector} from 'react-redux';
import {removePath} from '../Store/StoreInterface';
import {BackHandler} from 'react-native';
import {useEffect} from 'react';
function useBackButtonHandler() {
  return () => {
    const dispatch = useDispatch();

    const path = useSelector(state => {
      return state.config.path;
    });

    const isLoggedIn = useSelector(state => {
      return state.config.isLoggedIn;
    });

    const handleBackButtonClick = path => {
      if (path === '/home' && isLoggedIn) return false;
      else if (path === '/dashboard') return false;
      else {
        dispatch(removePath());
        return true;
      }
    };
    useEffect(() => {
      function backButtonHandler() {
        return handleBackButtonClick(path);
      }
      BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
      };
    }, [path]);
  };
}

export default useBackButtonHandler;
