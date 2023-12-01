import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Button from '../Components/Button';
import {useDispatch} from 'react-redux';
import {addPath, changePath} from '../Store/StoreInterface';
import useBackButtonHandler from '../Hooks/useBackButtonHandler';

function Dashboard() {
  const handleBackButton = useBackButtonHandler();
  handleBackButton();

  const dispatch = useDispatch();

  const onLoginClick = () => {
    // Handle login click
    dispatch(changePath('/login'));
    dispatch(addPath('/login'));
  };

  const onSignupClick = () => {
    // Handle signup click
    dispatch(changePath('/signup'));
    dispatch(addPath('/signup'));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to the Students Portal</Text>
      <Button text="Login" style={styles.button} onChange={onLoginClick} />
      <Button text="Signup" style={styles.button} onChange={onSignupClick} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 8,
    margin: 20,
    padding: '5%',
    height: '50%',
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

export default Dashboard;
