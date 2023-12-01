import React, {useState, useReducer, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Switch,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addPath,
  addSubject,
  addSubjectsToUser,
  addUsers,
  changePath,
  changeUserMark,
  deleteUser,
  fetchSubjects,
  fetchUsers,
  removeSubjectFromUser,
  updateUser,
  useDeleteSubjectFromUserMutation,
  useDeleteUserMutation,
  useGetAllSubjectsQuery,
  useGetAllUsersQuery,
  usePostAssignSubjectMutation,
  usePostCreatUserMutation,
  usePostCreateSubjectMutation,
  usePostUserMarkMutation,
  usePutUserMutation,
} from '../Store/StoreInterface';
import Button from '../Components/Button';
import Popup from '../Components/Popup';
import Menu, {
  MenuProvider,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import ChatIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Entypo';
import Form from '../Components/Form';
import useUserEditConfig from '../Hooks/useUserEditConfig';
import useAdminDashboardRedConfig from '../Hooks/useAdminDashboardRedConfig';
import AddSubjectIcon from 'react-native-vector-icons/MaterialIcons';
import useSignPageConfig from '../Hooks/useSignupPageConfig';
import useSubjectConfig from '../Hooks/useSubjectConfig';
import DropDownPicker from 'react-native-dropdown-picker';
// import CheckedBox from 'react-native-vector-icons/AntDesign';
// import NotCheckedBox from 'react-native-vector-icons/Feather';
// import DropDownPicker from 'react-native-dropdown-picker';

function reducer(state, action) {
  return {
    ...state,
    [action.type]: action.payload,
  };
}

function AdminDashboard() {
  const [state, dispatch] = useReducer(reducer, useAdminDashboardRedConfig());
  const users = useSelector(state => state.users);
  const subjects = useSelector(state => state.subjects);
  const getUsersResponse = useGetAllUsersQuery(state['page']);
  const dispatchStore = useDispatch();
  const [deleteUserMutation, deleteUserResponse] = useDeleteUserMutation();
  const [putUserMutation, putUserResponse] = usePutUserMutation();
  const [postCreateUserMutation, postCreateUserResponse] =
    usePostCreatUserMutation();
  const [postCreateSubjectMutation, postCreateSubjectResponse] =
    usePostCreateSubjectMutation();

  const [postAssignSubjectMutation, postAssignSubjectResponse] =
    usePostAssignSubjectMutation();

  const [postUserMarkMutation, postUserMarkResponse] =
    usePostUserMarkMutation();

  const getSubjectsResponse = useGetAllSubjectsQuery(
    state['subjectsAssigningPage'],
  );

  useEffect(() => {
    if (
      !getSubjectsResponse.isLoading &&
      !getSubjectsResponse.isUninitialized
    ) {
      if (getSubjectsResponse.isError) {
      } else {
        if (state['subjectsAssigningPage'] === 1) {
          dispatchStore(fetchSubjects(getSubjectsResponse.data));
        } else dispatchStore(addSubject(getSubjectsResponse.data));
      }
    }
  }, [getSubjectsResponse]);

  useEffect(() => {
    if (
      !postCreateSubjectResponse.isLoading &&
      !postCreateSubjectResponse.isUninitialized
    ) {
      if (postCreateSubjectResponse.isError) {
        dispatch({
          type: 'createSubjectResponseError',
          payload: 'Error occured , please check subject info',
        });
      } else {
        handleClosePopup();
        dispatchStore(addSubject([postCreateSubjectResponse.data]));
      }
    }
  }, [postCreateSubjectResponse]);

  useEffect(() => {
    if (!deleteUserResponse.isLoading && !deleteUserResponse.isUninitialized) {
      if (deleteUserResponse.isError) {
      } else {
        dispatchStore(deleteUser(state['selectedUserId']));
        handleClosePopup();
      }
    }
  }, [deleteUserResponse]);

  useEffect(() => {
    if (!getUsersResponse.isLoading && !getUsersResponse.isUninitialized) {
      if (getUsersResponse.isError) {
      } else {
        if (state['page'] === 1) {
          dispatchStore(fetchUsers(getUsersResponse.data.users));
        } else dispatchStore(addUsers(getUsersResponse.data.users));
      }
    }
  }, [getUsersResponse]);

  useEffect(() => {
    if (!putUserResponse.isLoading && !putUserResponse.isUninitialized) {
      if (putUserResponse.isError) {
        dispatch({
          type: 'editResponseError',
          payload: 'Error occured while updating user info',
        });
      } else {
        dispatchStore(updateUser(putUserResponse.originalArgs));
        dispatch({type: 'user', payload: null});
        dispatch({type: 'selectedUserId', payload: null});
        dispatch({type: 'isActivated', payload: null});
        handleClosePopup();
      }
    }
  }, [putUserResponse]);

  useEffect(() => {
    if (
      state['selectedUserId'] !== null &&
      state['selectedUserId'] !== undefined
    ) {
      const [selectedUser] = users.filter(usr => {
        return usr.id === state['selectedUserId'];
      });

      dispatch({type: 'user', payload: selectedUser});
      dispatch({type: 'isActivated', payload: selectedUser.isActivated});
    }
  }, [state['selectedUserId']]);

  useEffect(() => {
    if (state['user'] !== null && state['user'] !== undefined) {
      dispatch({
        type: 'editForm',
        payload: (
          <Form
            config={useUserEditConfig(state['user'])}
            formStyle={{backgroundColor: 'white'}}
            submitButtonTitle="Save"
            submitButtonTitleStyle={styles.submitButtonTitleStyle}
            onSubmit={handleEditSubmit}
            responseError={state['editResponseError']}
            setResponseError={err => {
              dispatch({type: 'editResponseError', payload: err});
            }}
            doValidation={false}
            buttonIcon={<Icon name="save" size={30} color="black" />}
            buttonStyle={styles.modalButton}>
            <View style={styles.elementContainer}>
              <Text style={styles.labelForm}>Activate </Text>
              <Switch
                trackColor={{false: '#767577', true: 'gray'}}
                thumbColor={state['isActivated'] ? 'black' : '#f4f3f4'}
                onValueChange={() => {
                  onSwitchChange((type = 'isActivated'));
                }}
                value={state['isActivated']}
              />
            </View>
          </Form>
        ),
      });
    }
  }, [state['user'], state['isActivated'], state['editResponseError']]);

  useEffect(() => {
    dispatch({
      type: 'createSubjectForm',
      payload: (
        <Form
          config={useSubjectConfig()}
          formStyle={{backgroundColor: 'white'}}
          submitButtonTitle="Save"
          submitButtonTitleStyle={styles.submitButtonTitleStyle}
          onSubmit={handleCreateSubjectSubmit}
          responseError={state['createSubjectResponseError']}
          setResponseError={err => {
            dispatch({type: 'createSubjectResponseError', payload: err});
          }}
          doValidation={true}
          buttonIcon={<Icon name="save" size={30} color="black" />}
          buttonStyle={styles.modalButton}></Form>
      ),
    });
  }, [state['subject'], state['createSubjectResponseError']]);

  useEffect(() => {
    if (
      state['createdUserData'] !== null &&
      state['createdUserData'] !== undefined
    ) {
      dispatch({
        type: 'createUserForm',
        payload: (
          <Form
            config={useSignPageConfig()}
            formStyle={{backgroundColor: 'white'}}
            submitButtonTitle="Save"
            doValidation={true}
            submitButtonTitleStyle={styles.submitButtonTitleStyle}
            onSubmit={handleCreateUserSubmit}
            responseError={state['createUserResponseError']}
            setResponseError={err => {
              dispatch({type: 'createUserResponseError', payload: err});
            }}
            buttonIcon={<Icon name="save" size={30} color="black" />}
            buttonStyle={styles.modalButton}>
            <View style={styles.elementContainer}>
              <Text style={styles.labelForm}>Activate </Text>
              <Switch
                trackColor={{false: '#767577', true: 'gray'}}
                thumbColor={state['createUserIsActivate'] ? 'black' : '#f4f3f4'}
                onValueChange={() => {
                  onSwitchChange((type = 'createUserIsActivate'));
                }}
                value={state['createUserIsActivate']}
              />
            </View>
          </Form>
        ),
      });
    }
  }, [
    state['createdUserData'],
    state['createUserResponseError'],
    state['createUserIsActivate'],
  ]);

  useEffect(() => {
    if (
      !postCreateUserResponse.isLoading &&
      !postCreateUserResponse.isUninitialized
    ) {
      if (postCreateUserResponse.isError) {
        dispatch({
          type: 'createUserResponseError',
          payload: 'Error occured please check user info',
        });
      } else {
        dispatchStore(addUsers([postCreateUserResponse.data]));
        handleClosePopup();
        getUsersResponse.refetch(state['page']);
      }
    }
  }, [postCreateUserResponse]);

  useEffect(() => {
    const notRegisteredUsersConfig = [];
    const registeredUsersConfig = [];

    users.map(usr => {
      if (usr.subjects.find(sub => sub.id === state['dropdownValue'])) {
        registeredUsersConfig.push({id: usr.id, username: usr.username});
      } else {
        notRegisteredUsersConfig.push({value: usr.id, label: usr.username});
      }
      return usr;
    });

    if (notRegisteredUsersConfig.length == 0)
      dispatch({type: 'userDropDownSubjectAssignValue', payload: null});
    else
      dispatch({
        type: 'userDropDownSubjectAssignValue',
        payload: notRegisteredUsersConfig[0].value,
      });
    const subjectsConfigArr = subjects.reduce((prevSub, currSub) => {
      return [...prevSub, {label: currSub.name, value: currSub.id}];
    }, []);

    dispatch({type: 'notRegisteredUsers', payload: notRegisteredUsersConfig});
    dispatch({type: 'configDropDown', payload: subjectsConfigArr});
  }, [state['dropdownValue'], state['userDropDownSubjectAssignValue'], users]);

  useEffect(() => {
    dispatch({
      type: 'assignSubjectComponent',
      payload: (
        <View>
          <View style={styles.assignSubjectComponentContainer}>
            <View style={{width: '100%'}}>
              <DropDownPicker
                listMode="FLATLIST"
                flatListProps={{
                  onEndReached: () => {
                    if (state['dropDownIsOpen']) handleNextSubjectsPage();
                  },
                }}
                placeholder="Select a subject"
                value={state['dropdownValue']}
                style={{
                  width: '100%',
                  marginBottom: '2%',
                  zIndex: state['dropDownIsOpen'] ? 1 : 0,
                }}
                items={state['configDropDown']}
                open={state['dropDownIsOpen']}
                setOpen={isOpen => {
                  dispatch({
                    type: 'usersAssignSubjectDropDownIsOpen',
                    payload: false,
                  });
                  dispatch({type: 'dropDownIsOpen', payload: isOpen});
                }}
                setValue={val => {
                  dispatch({type: 'dropdownValue', payload: val()});
                }}
                setItem={its => {
                  dispatch({type: 'subjectsDropDown', payload: its});
                }}
              />

              <DropDownPicker
                listMode="FLATLIST"
                flatListProps={{
                  onEndReached: () => {
                    if (state['usersAssignSubjectDropDownIsOpen'])
                      handleNextStudentsPage();
                  },
                }}
                placeholder="Select a user"
                value={state['userDropDownSubjectAssignValue']}
                style={{
                  width: '100%',
                  zIndex: state['usersAssignSubjectDropDownIsOpen'] ? 2 : 0,
                }}
                items={state['notRegisteredUsers']}
                open={state['usersAssignSubjectDropDownIsOpen']}
                setOpen={isOpen => {
                  dispatch({type: 'dropDownIsOpen', payload: false});
                  dispatch({
                    type: 'usersAssignSubjectDropDownIsOpen',
                    payload: isOpen,
                  });
                }}
                setValue={val => {
                  dispatch({
                    type: 'userDropDownSubjectAssignValue',
                    payload: val(),
                  });
                }}
                setItem={its => {
                  dispatch({type: 'notRegisteredUsers', payload: its});
                }}
              />
            </View>
          </View>
          <View style={styles.errorFormContainer}>
            <Text style={styles.errorText}>{state['assignSubjectError']}</Text>
          </View>
          {state['userDropDownSubjectAssignValue'] !== null &&
          state['dropdownValue'] !== null ? (
            <Button
              text="Save"
              onChange={handleAssignSubjects}
              style={{
                ...styles.modalButton,
                text: 'black',
                flexDirection: 'row',
                justifyContent: 'center',
                padding: '3%',
              }}>
              <Icon name="save" size={30} color="black" />
            </Button>
          ) : (
            ''
          )}
        </View>
      ),
    });
  }, [
    state['assignSubjectPopup'],
    state['subjectsAssigningPage'],
    state['studentsAssigningPage'],
    state['userDropDownSubjectAssignValue'],
    state['assignSubjectError'],
    state['dropdownValue'],
    state['dropDownIsOpen'],
    state['usersAssignSubjectDropDownIsOpen'],
    state['notRegisteredUsers'],
    users,
    subjects,
  ]);

  useEffect(() => {
    if (
      !postAssignSubjectResponse.isLoading &&
      !postAssignSubjectResponse.isUninitialized
    ) {
      console.log(postAssignSubjectResponse);
      if (postAssignSubjectResponse.isError) {
      } else {
        dispatchStore(
          addSubjectsToUser({
            user_id: state['userDropDownSubjectAssignValue'],
            subject_id: state['dropdownValue'],
          }),
        );
      }
    }
  }, [postAssignSubjectResponse]);

  useEffect(() => {
    const usersConfigArr = users.reduce((prevUsr, curUsr) => {
      return [...prevUsr, {label: curUsr.username, value: curUsr.id}];
    }, []);

    if (state['userDropDownValue'] !== null) {
      const [selectedUser] = users.filter(usr => {
        return usr.id === state['userDropDownValue'];
      });
      const registeredSubjectsByUser = subjects.reduce((prevSub, curSub) => {
        const subject = selectedUser.subjects.find(
          subj => subj.id === curSub.id,
        );
        if (subject) {
          return [
            ...prevSub,
            {value: curSub.id, mark: subject.mark, label: curSub.name},
          ];
        } else {
          return prevSub;
        }
      }, []);
      if (registeredSubjectsByUser.length == 0)
        dispatch({type: 'subjectMarkRegisteredByUserValue', payload: null});
      else
        dispatch({
          type: 'subjectMarkRegisteredByUserValue',
          payload: registeredSubjectsByUser[0].value,
        });
      dispatch({
        type: 'registeredSubjectsByUser',
        payload: [...registeredSubjectsByUser],
      });
    }
    dispatch({type: 'usersConfigDropDown', payload: usersConfigArr});
  }, [state['userDropDownValue'], users]);

  useEffect(() => {
    dispatch({
      type: 'setMarkComponent',
      payload: (
        <View style={{width: '100%', marginRight: '3%', width: '100%'}}>
          <DropDownPicker
            listMode="FLATLIST"
            flatListProps={{
              onEndReached: () => {
                if (state['userDropDownIsopen']) handleNextStudentsPage();
              },
            }}
            placeholder="Select a user"
            value={state['userDropDownValue']}
            style={{
              width: '100%',
              marginBottom: '2%',
              zIndex: state['dropDownIsOpen'] ? 1 : 0,
            }}
            items={state['usersConfigDropDown']}
            open={state['userDropDownIsopen']}
            setOpen={isOpen => {
              dispatch({type: 'userDropDownIsopen', payload: isOpen});
              dispatch({
                type: 'subjectMarkRegisteredByUserIsOpen',
                payload: false,
              });
            }}
            setValue={val => {
              dispatch({type: 'userDropDownValue', payload: val()});
            }}
            setItem={its => {
              dispatch({type: 'usersDropDown', payload: its});
            }}
          />
          <DropDownPicker
            listMode="FLATLIST"
            flatListProps={{
              onEndReached: () => {
                if (state['subjectMarkRegisteredByUserIsOpen'])
                  handleNextSubjectsPage();
              },
            }}
            placeholder="Select a subject"
            value={state['subjectMarkRegisteredByUserValue']}
            style={{
              width: '100%',
              marginBottom: '2%',
              zIndex: state['dropDownIsOpen'] ? 1 : 0,
            }}
            items={state['registeredSubjectsByUser']}
            open={state['subjectMarkRegisteredByUserIsOpen']}
            setOpen={isOpen => {
              dispatch({type: 'userDropDownIsopen', payload: false});
              dispatch({
                type: 'subjectMarkRegisteredByUserIsOpen',
                payload: isOpen,
              });
            }}
            setValue={val => {
              console.log(val());
              dispatch({
                type: 'subjectMarkRegisteredByUserValue',
                payload: val(),
              });
            }}
            setItem={its => {
              dispatch({type: 'registeredSubjectsByUser', payload: its});
            }}
          />

          {state['registeredSubjectsByUser'] === null ||
          state['registeredSubjectsByUser'].length === 0 ? (
            <Text>Student has no registered courses</Text>
          ) : (
            ''
          )}
          <View style={styles.errorFormContainer}>
            <Text style={styles.errorText}>
              {state['setMarkResponseError']}
            </Text>
          </View>
          {console.log(state['registeredSubjectsByUser'])}
          {state['subjectMarkRegisteredByUserValue'] !== null &&
          state['userDropDownValue'] !== null ? (
            <View style={{width: '100%'}}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 20, color: 'black'}}>Mark</Text>
                {console.log(state['subjectMarkRegisteredByUserValue'])}
                <TextInput
                  keyboardType="numeric"
                  value={state['markValue']}
                  style={styles.markInput}
                  placeholder={
                    state['registeredSubjectsByUser'] !== null &&
                    state['registeredSubjectsByUser'] !== undefined &&
                    state['registeredSubjectsByUser'].length !== 0 &&
                    state['subjectMarkRegisteredByUserValue'] !== null
                      ? state['registeredSubjectsByUser']
                          .filter(regSub => {
                            return (
                              regSub.value ===
                              state['subjectMarkRegisteredByUserValue']
                            );
                          })[0]
                          .mark.toString()
                      : '0'
                  }
                  onChangeText={text => {
                    dispatch({type: 'setMarkResponseError', payload: ''});
                    dispatch({
                      type: 'markValue',
                      payload: text,
                    });
                  }}
                />
              </View>
              <View>
                <Button
                  text="Save"
                  onChange={handleSaveMark}
                  style={{
                    ...styles.modalButton,
                    text: 'black',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    padding: '3%',
                  }}>
                  <Icon name="save" size={30} color="black" />
                </Button>
              </View>
            </View>
          ) : (
            ''
          )}
        </View>
      ),
    });
  }, [
    users,
    state['markValue'],
    state['registeredSubjectsByUser'],
    state['userDropDownIsopen'],
    state['userDropDownValue'],
    state['setMarkResponseError'],
    state['subjectMarkRegisteredByUserValue'],
    state['subjectMarkRegisteredByUserIsOpen'],
  ]);
  useEffect(() => {
    if (
      !postUserMarkResponse.isLoading &&
      !postUserMarkResponse.isUninitialized
    ) {
      if (postUserMarkResponse.isError) {
        dispatch({
          type: 'setMarkResponseError',
          payload: 'Error while setting user mark',
        });
      } else {
        dispatchStore(
          changeUserMark({
            user_id: state['userDropDownValue'],
            subjects: [...postUserMarkResponse.originalArgs.subjects],
          }),
          dispatch({type: 'markValue', payload: ''}),
        );
      }
    }
  }, [postUserMarkResponse]);

  function handleChatPage() {
    console.log(5)
    dispatchStore(changePath('/chat'));
    dispatchStore(addPath('/chat'));
  }

  function handleAssignSubjects() {
    const user_id = state['userDropDownSubjectAssignValue'];
    const subject_id = state['dropdownValue'];
    if (
      user_id !== null &&
      user_id !== undefined &&
      subject_id !== null &&
      subject_id !== undefined
    ) {
      postAssignSubjectMutation({
        user_id: Number(user_id),
        subject_id: Number(subject_id),
      });
    } else
      dispatch({
        type: 'assignSubjectError',
        payload: 'You have to select a subject and a user',
      });
    handleClosePopup();
  }

  function handleSaveMark() {
    const user_id = state['userDropDownValue'];
    const subject_id = state['subjectMarkRegisteredByUserValue'];
    const mark = state['markValue'];
    if (mark !== null && mark !== undefined && mark !== '')
      postUserMarkMutation({user_id, subjects: [{id: subject_id, mark}]});
    else
      dispatch({
        type: 'setMarkResponseError',
        value: 'You must enter a mark value first',
      });
  }

  function handleNextStudentsPage() {
    dispatch({type: 'page', payload: 1});
  }

  function handleNextSubjectsPage() {
    if (getSubjectsResponse.data.length !== 0) {
      getSubjectsResponse.refetch(state['subjectsAssigningPage'] + 1);
      dispatch({
        type: 'subjectsAssigningPage',
        payload: state['subjectsAssigningPage'] + 1,
      });
    }
  }

  function handleCreateSubjectSubmit(subjectData) {
    postCreateSubjectMutation(subjectData);
  }

  function onSwitchChange(type) {
    dispatch({type: type, payload: !state[type]});
  }

  function handleNextPage() {
    if (getUsersResponse.data.users.length !== 0) {
      getUsersResponse.refetch(state['page'] + 1);
      dispatch({type: 'page', payload: state['page'] + 1});
    }
  }

  function handleEditSubmit(userData, validation) {
    if (
      validation.includes('username') &&
      validation.includes('email') &&
      state['isActivated'] === state['user'].isActivated
    ) {
      dispatch({
        type: 'editResponseError',
        payload: "User info is not changed can't perform the operation",
      });
    } else
      putUserMutation({
        id: state['selectedUserId'],
        email: userData.email !== '' ? userData.email : state['user'].email,
        username:
          userData.username !== '' ? userData.username : state['user'].username,
        isActivated:
          state.isActivated !== null
            ? state.isActivated
            : state['user'].isActivated,
      });
  }

  function handleDelete(id) {
    deleteUserMutation(id);
    dispatch({type: 'deletePopup', payload: true});
  }

  function handleClosePopup() {
    dispatch({type: 'deletePopup', payload: false});
    dispatch({type: 'savePopup', payload: false});
    dispatch({type: 'createUserPopup', payload: false});
    dispatch({type: 'createSubjectPopup', payload: false});
    dispatch({type: 'assignSubjectPopup', payload: false});
    dispatch({type: 'setMarkPopup', payload: false});
    dispatch({type: 'editResponseError', payload: ''});
    dispatch({type: 'createUserResponseError', payload: ''});
    dispatch({type: 'createSubjectResponseError', payload: ''});
    dispatch({type: 'assignSubjectResponseError', payload: ''});
    dispatch({type: 'userDropDownSubjectAssignValue', payload: null});
    dispatch({type: 'subjectsDropDown', payload: {}});
    dispatch({type: 'selectedSubjectsIds', payload: []});
    dispatch({type: 'studentsIsChecked', payload: {}});
  }

  function handleCreateUserSubmit(userData) {
    postCreateUserMutation({
      ...userData,
      isActivated: state['createUserIsActivate'],
    });
  }

  if (users.length === 0) {
    return (
      <MenuProvider>
        <View>
          <View>
            <Menu>
              <MenuTrigger customStyles={menueTriggerStyles}>
                <View>
                  <Icon name="menu" size={30} color="black" />
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={crudopOptionsStyles}>
                <MenuOption
                  onSelect={() => {
                    dispatch({type: 'createUserPopup', payload: true});
                    dispatch({
                      type: 'popupTitle',
                      payload: 'Create user ?',
                    });
                    dispatch({type: 'createdUserData', payload: {}});
                  }}
                  customStyles={menuOptionStyles}>
                  <View style={styles.iconButton}>
                    <Icon name="add-user" size={10} color="green" />
                    <Text style={styles.buttonText}>Create user</Text>
                  </View>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    dispatch({type: 'createSubjectPopup', payload: true});
                    dispatch({
                      type: 'popupTitle',
                      payload: 'Create subject ?',
                    });
                  }}
                  customStyles={menuOptionStyles}>
                  <View style={styles.iconButton}>
                    <AddSubjectIcon
                      name="library-add"
                      size={10}
                      color="green"
                    />
                    <Text style={styles.buttonText}>Create subject</Text>
                  </View>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    dispatch({type: 'assignSubjectPopup', payload: true});
                    dispatch({
                      type: 'popupTitle',
                      payload: 'Assign subject to user ?',
                    });
                  }}
                  customStyles={menuOptionStyles}>
                  <View style={styles.iconButton}>
                    <AddSubjectIcon
                      name="assignment-add"
                      size={10}
                      color="green"
                    />
                    <Text style={styles.buttonText}>Assign subject</Text>
                  </View>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    dispatch({type: 'setMarkPopup', payload: true});
                    dispatch({
                      type: 'popupTitle',
                      payload: 'Set student mark ?',
                    });
                  }}
                  customStyles={menuOptionStyles}>
                  <View style={styles.iconButton}>
                    <AddSubjectIcon
                      name="bookmark-add"
                      size={10}
                      color="green"
                    />
                    <Text style={styles.buttonText}>Assign mark</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <Popup
            style={styles.editModal}
            visible={state['createUserPopup']}
            onClose={handleClosePopup}
            title={state['popupTitle']}>
            <View style={styles.iconButton}>
              {state['createUserPopup'] ? state['createUserForm'] : ''}
            </View>
          </Popup>

          <Popup
            style={styles.editModal}
            visible={state['createSubjectPopup']}
            onClose={handleClosePopup}
            title={state['popupTitle']}>
            <View style={styles.iconButton}>
              {state['createSubjectPopup'] ? state['createSubjectForm'] : ''}
            </View>
          </Popup>

          <Popup
            style={styles.editModal}
            visible={state['assignSubjectPopup']}
            onClose={handleClosePopup}
            title={state['popupTitle']}>
            <View style={styles.iconButton}>
              {state['assignSubjectPopup']
                ? state['assignSubjectComponent']
                : ''}
            </View>
          </Popup>

          <Popup
            style={styles.editModal}
            visible={state['setMarkPopup']}
            onClose={handleClosePopup}
            title={state['popupTitle']}>
            <View style={styles.iconButton}>
              {state['setMarkPopup'] ? state['setMarkComponent'] : ''}
            </View>
          </Popup>
          <Text style={styles.title}>No users were found</Text>
        </View>
      </MenuProvider>
    );
  }

  return (
    <MenuProvider>
      <View style={styles.container}>
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
        <Menu>
          <MenuTrigger customStyles={menueTriggerStyles}>
            <View>
              <Icon name="menu" size={30} color="black" />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={crudopOptionsStyles}>
            <MenuOption
              onSelect={() => {
                dispatch({type: 'createUserPopup', payload: true});
                dispatch({
                  type: 'popupTitle',
                  payload: 'Create user ?',
                });
                dispatch({type: 'createdUserData', payload: {}});
              }}
              customStyles={menuOptionStyles}>
              <View style={styles.iconButton}>
                <Icon name="add-user" size={10} color="green" />
                <Text style={styles.buttonText}>Create user</Text>
              </View>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                dispatch({type: 'createSubjectPopup', payload: true});
                dispatch({
                  type: 'popupTitle',
                  payload: 'Create subject ?',
                });
              }}
              customStyles={menuOptionStyles}>
              <View style={styles.iconButton}>
                <AddSubjectIcon name="library-add" size={10} color="green" />
                <Text style={styles.buttonText}>Create subject</Text>
              </View>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                dispatch({type: 'assignSubjectPopup', payload: true});
                dispatch({
                  type: 'popupTitle',
                  payload: 'Assign subject to user ?',
                });
                dispatch({
                  type: 'dropdownValue',
                  payload:
                    subjects !== undefined &&
                    subjects !== null &&
                    subjects.length !== 0
                      ? subjects[0].id
                      : 0,
                });
                dispatch({
                  type: 'userDropDownSubjectAssignValue',
                  payload:
                    users !== undefined && users !== null && users.length !== 0
                      ? users[0].id
                      : 0,
                });
              }}
              customStyles={menuOptionStyles}>
              <View style={styles.iconButton}>
                <AddSubjectIcon name="assignment-add" size={10} color="green" />
                <Text style={styles.buttonText}>Assign subject</Text>
              </View>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                dispatch({type: 'setMarkPopup', payload: true});
                dispatch({
                  type: 'popupTitle',
                  payload: 'Set student mark ?',
                });
                dispatch({
                  type: 'userDropDownValue',
                  payload:
                    users !== undefined && users !== null && users.length !== 0
                      ? users[0].id
                      : 0,
                });
              }}
              customStyles={menuOptionStyles}>
              <View style={styles.iconButton}>
                <AddSubjectIcon name="bookmark-add" size={10} color="green" />
                <Text style={styles.buttonText}>Assign mark</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
        <FlatList
          data={users}
          renderItem={({item}) => (
            <View style={styles.userContainer}>
              <View style={styles.iconContainer}>
                <Text style={styles.username}>{item.username}</Text>
                <Menu>
                  <MenuTrigger customStyles={triggerStyles}>
                    <View>
                      <Icon
                        name="dots-three-vertical"
                        size={20}
                        color="black"
                      />
                    </View>
                  </MenuTrigger>
                  <MenuOptions customStyles={optionsStyles}>
                    <MenuOption
                      onSelect={() => {
                        dispatch({type: 'deletePopup', payload: true});
                        dispatch({
                          type: 'popupTitle',
                          payload: 'Confirm deletion ?',
                        });
                        dispatch({type: 'selectedUserId', payload: item.id});
                      }}
                      customStyles={menuOptionStyles}>
                      <View style={styles.iconButton}>
                        <Icon name="trash" size={10} color="red" />
                        <Text style={styles.buttonText}>Delete</Text>
                      </View>
                    </MenuOption>

                    <MenuOption
                      onSelect={() => {
                        dispatch({type: 'popupTitle', payload: 'Save edits ?'});
                        dispatch({type: 'selectedUserId', payload: item.id});
                        dispatch({type: 'savePopup', payload: true});
                      }}
                      customStyles={menuOptionStyles}>
                      <View style={styles.iconButton}>
                        <Icon name="pencil" size={10} color="blue" />
                        <Text style={styles.buttonText}>Edit</Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
              <Popup
                visible={
                  state['deletePopup'] && state['selectedUserId'] === item.id
                }
                onClose={handleClosePopup}
                title={state['popupTitle']}>
                <Button
                  onChange={() => {
                    handleDelete(item.id);
                  }}
                  text={
                    <View style={styles.iconButton}>
                      <Icon name="trash" size={30} color="red" />
                      <Text style={styles.buttonText}>Delete</Text>
                    </View>
                  }
                  style={styles.modalButton}
                />
              </Popup>

              <Popup
                style={styles.editModal}
                visible={
                  state['savePopup'] && state['selectedUserId'] === item.id
                }
                onClose={handleClosePopup}
                title={state['popupTitle']}>
                <View style={styles.iconButton}>
                  {state['savePopup'] ? state['editForm'] : ''}
                </View>
              </Popup>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
          onEndReached={handleNextPage}
        />
        <Popup
          style={styles.editModal}
          visible={state['createUserPopup']}
          onClose={handleClosePopup}
          title={state['popupTitle']}>
          <View style={styles.iconButton}>
            {state['createUserPopup'] ? state['createUserForm'] : ''}
          </View>
        </Popup>

        <Popup
          style={styles.editModal}
          visible={state['createSubjectPopup']}
          onClose={handleClosePopup}
          title={state['popupTitle']}>
          <View style={styles.iconButton}>
            {state['createSubjectPopup'] ? state['createSubjectForm'] : ''}
          </View>
        </Popup>

        <Popup
          style={styles.editModal}
          visible={state['assignSubjectPopup']}
          onClose={handleClosePopup}
          title={state['popupTitle']}>
          <View style={styles.iconButton}>
            {state['assignSubjectPopup'] ? state['assignSubjectComponent'] : ''}
          </View>
        </Popup>

        <Popup
          style={styles.editModal}
          visible={state['setMarkPopup']}
          onClose={handleClosePopup}
          title={state['popupTitle']}>
          <View style={styles.iconButton}>
            {state['setMarkPopup'] ? state['setMarkComponent'] : ''}
          </View>
        </Popup>
      </View>
    </MenuProvider>
  );
}

const triggerStyles = {
  triggerTouchable: {underlayColor: 'white', activeOpacity: 70},
  triggerWrapper: {paddingRight: 5},
  triggerText: {color: 'white'},
};

const menueTriggerStyles = {
  triggerTouchable: {underlayColor: 'white', activeOpacity: 0},
  triggerWrapper: {paddingRight: 5, width: '10%'},
  triggerText: {color: 'white'},
};

const optionsStyles = {
  optionsContainer: {
    backgroundColor: 'white',
    padding: 2,
    width: '25%',
    height: '22%',
    borderRadius: 10,
  },

  optionTouchable: {
    activeOpacity: 70,
  },
  optionText: {color: 'black'},
};

const crudopOptionsStyles = {
  optionsContainer: {
    backgroundColor: 'white',
    padding: 2,
    width: '40%',
    height: '42%',
    borderRadius: 10,
  },

  optionTouchable: {
    activeOpacity: 70,
  },
  optionText: {color: 'black'},
};

const menuOptionStyles = {
  optionTouchable: {
    underlayColor: 'white',
    activeOpacity: 20,
  },
};

const styles = StyleSheet.create({
  modalButton: {
    alignContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    width: '33%',
    color: 'black',
  },
  submitButtonTitleStyle: {
    color: 'black',
  },
  errorText: {color: 'red', margin: '2%'},
  errorFormContainer: {
    padding: '1%',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  userContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 3,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    borderRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 3,
  },
  flatListContent: {
    paddingBottom: 20,
    borderRadius: 3,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    marginLeft: 5,
  },
  checkbox: {
    width: 20,
    height: '15%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  editModal: {
    height: '88%',
  },
  elementContainer: {
    flex: 1,
    flexDirection: 'center',
    padding: '1%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  labelForm: {
    color: 'black',
    alignContent: 'center',
    justifyContent: 'center',
    padding: '5%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  createButton: {
    alignContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
    width: '13%',
    flexDirection: 'row',
    padding: '1%',
    text: 'black',
  },
  assignSubjectComponentContainer: {
    flexDirection: 'row',
  },
  markInput: {
    borderColor: 'black',
    borderRadius: 15,
    height: '100%',
    width: '50%',
    borderWidth: 2,
    color: 'black',
    textAlign: 'center',
  },
});

export default AdminDashboard;
