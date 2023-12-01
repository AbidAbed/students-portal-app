const {Text, StyleSheet, ScrollView, View} = require('react-native');
import Button from '../Components/Button';
import useBackButtonHandler from '../Hooks/useBackButtonHandler';
import {
  addPath,
  changePath,
  changePathStack,
  usePostLogoutMutation,
} from '../Store/StoreInterface';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

function Home() {
  const role = useSelector(state => {
    return state.config.role;
  });

  const handleBackButton = useBackButtonHandler();
  handleBackButton();

  const dispatch = useDispatch();

  const [postLogout, postLogoutResponse] = usePostLogoutMutation();

  function onLogoutPress() {
    postLogout();
  }

  useEffect(() => {
    if (!postLogoutResponse.isLoading && !postLogoutResponse.isUninitialized) {
      if (postLogoutResponse.isError) {
      } else {
        dispatch(changePathStack([]));
        dispatch(changePath('/dashboard'));
        dispatch(addPath('/dashboard'));
        // dispatch(changeIsLoggedIn(false));
      }
    }
  }, [postLogoutResponse]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello {role} , Wellcome</Text>
      {role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
      <Button text="Logout" onChange={onLogoutPress} style={styles.button} />
    </View>
  );
}
export default Home;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 8,
    margin: '10%',
    height: '5%',
  },
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '10%',
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    justifyContent: 'center',
    padding: '5%',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '20%',
  },
});
