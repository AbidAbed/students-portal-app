import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  addPath,
  changeIsLoggedIn,
  changePath,
  removePath,
  usePostLogoutMutation,
  fetchUserData,
} from '../Store/StoreInterface';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import Popup from '../Components/Popup';
import Button from '../Components/Button';
import ChatIcon from 'react-native-vector-icons/AntDesign';

function StudentDashboard() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [postLogoutMutation, postLogoutResponse] = usePostLogoutMutation();
  const [activationModalVisible, setActivationModalVisible] = useState(false);

  useEffect(() => {
    if (!user.isActivated) setActivationModalVisible(true);
  }, [user]);

  useEffect(() => {
    if (!postLogoutResponse.isLoading && !postLogoutResponse.isUninitialized) {
      if (postLogoutResponse.isError) {
        // Handle error
      } else {
        dispatch(fetchUserData({}));
        dispatch(changePath('/login'));
        dispatch(removePath('/home'));
        dispatch(addPath('/login'));
        dispatch(changeIsLoggedIn(false));
      }
    }
  }, [postLogoutResponse]);

  function handleChatPage() {
    dispatch(changePath('/chat'));
    dispatch(addPath('/chat'));
  }


  return (
    <View style={styles.container}>
      {user !== null && user.id !== undefined ? (
        user.isActivated ? (
          <>
            <View>
              <Button
                text="Go to chat"
                onChange={handleChatPage}
                style={{
                  text: 'black',
                  fontSize: 20,
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 5,
                  width: '40%',
                  padding: '2%',
                  marginBottom: '3%',
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  marginTop: '2%',
                }}>
                <ChatIcon
                  name="wechat"
                  size={20}
                  color="blue"
                  style={{padding: '2%'}}
                />
              </Button>
            </View>
            <View style={styles.userInfoContainer}>
              <View style={styles.subjectRow}>
                <Text style={styles.columnLabel}>Username:</Text>
                <Text style={styles.userInfoText}> {user.username}</Text>
              </View>

              <View style={styles.subjectRow}>
                <Text style={styles.columnLabel}>Email:</Text>
                <Text style={styles.userInfoText}>{user.email}</Text>
              </View>
            </View>
            <View style={styles.userInfoContainer}>
              <Text style={styles.columnLabel}>Subjects</Text>
              <View style={styles.subjectsContainer}>
                <View style={styles.subjectRow}>
                  <Text style={styles.columnLabel}>Name</Text>
                  <Text style={styles.columnLabel}>Pass Marks</Text>
                  <Text style={styles.columnLabel}>Your Marks</Text>
                </View>
                <FlatList
                  data={user.subjects}
                  renderItem={({item}) => {
                    return (
                      <View style={styles.subjectRow} key={item.id}>
                        <Text style={styles.columnValue}>{item.name}</Text>
                        <Text style={styles.columnValue}>{item.passmark}</Text>
                        <Text style={styles.columnValue}>{item.mark}</Text>
                      </View>
                    );
                  }}
                  scrollEnabled={true}
                />
              </View>
            </View>
          </>
        ) : (
          <Popup
            style={styles.activateModal}
            visible={activationModalVisible}
            onClose={() => {
              setActivationModalVisible(false);
              postLogoutMutation();
            }}
            title="ACTIVATION PROBLEM !">
            <View style={styles.iconButton}>
              <Text style={styles.errorMessage}>
                Please contact the admin, your account is not activated!
              </Text>
            </View>
          </Popup>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  userInfoContainer: {
    backgroundColor: 'white',
    padding: '5%',
    borderRadius: 10,
    marginBottom: '5%',
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: '2%',
  },
  subjectsContainer: {
    marginTop: '2%',
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '2%',
    alignItems: 'center',
  },
  columnLabel: {
    width: '33%',
    fontWeight: 'bold',
  },
  columnValue: {
    width: '33%',
  },
  modalButton: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    width: '33%',
    color: 'black',
  },
  activateModal: {
    height: '40%',
  },
  errorMessage: {
    fontSize: 16,
    padding: '5%',
    color: 'red',
  },
});

export default StudentDashboard;
