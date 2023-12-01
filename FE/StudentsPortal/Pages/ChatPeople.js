import React, {useState, useEffect} from 'react';
import {FlatList, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import useBackButtonHandler from '../Hooks/useBackButtonHandler';
import {
  addPath,
  changePath,
  changeSelectedUserToChat,
  fetchChatPeople,
  useGetChatPeopleQuery,
} from '../Store/StoreInterface';
import {useDispatch, useSelector} from 'react-redux';

function ChatPeople() {
  const [flatListData, setFlatListData] = useState([]);
  const dispatch = useDispatch();
  const handleBackButton = useBackButtonHandler();
  handleBackButton();
  const [peopleChatPage, setPeopleChatPage] = useState(1);
  const user = useSelector(state => state.user);
  const getChatPeopleResponse = useGetChatPeopleQuery({
    id: user.id,
    page: peopleChatPage,
  });

  const chatPeople = useSelector(state => state.chat);

  const [isInitial, setIsInitial] = useState(true);
  useEffect(() => {
    const people = Object.entries(chatPeople).reduce((prevVal, curVal) => {
      return [...prevVal, {id: curVal[0], username: curVal[1].username}];
    }, []);
    setFlatListData(people);
  }, [chatPeople]);

  useEffect(() => {
    if (
      !getChatPeopleResponse.isLoading &&
      !getChatPeopleResponse.isUninitialized
    ) {
      if (getChatPeopleResponse.isError) {
        // Handle error
      } else {
        if (isInitial) {
          setPeopleChatPage(peopleChatPage + 1);
          setIsInitial(false);
        }
        dispatch(fetchChatPeople(getChatPeopleResponse.data));
      }
    }
  }, [getChatPeopleResponse]);

  function handleNextPage() {
    console.log(2001);
    if (getChatPeopleResponse.data.length !== 0) {
      getChatPeopleResponse.refetch({id: user.id, page: peopleChatPage + 1});
      setPeopleChatPage(peopleChatPage + 1);
    }
  }

  console.log('page', peopleChatPage);
  const renderItem = ({item}) => {
    if (item.id !== user.id)
      return (
        <TouchableOpacity
          style={styles.userItem}
          onPress={() => {
            dispatch(changeSelectedUserToChat(item.id));
            dispatch(changePath('/chatRoom'));
            dispatch(addPath('/chatRoom'));
          }}>
          <Text style={styles.username}>{item.username}</Text>
        </TouchableOpacity>
      );
    else return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleNextPage}
        onEndReachedThreshold={0.5}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  userItem: {
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  flatList: {
    backgroundColor: '#f5f5f5',
  },
});

export default ChatPeople;
