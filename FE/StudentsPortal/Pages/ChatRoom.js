import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList, View} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  useTheme,
  TextInput,
  Button,
  Avatar,
} from 'react-native-paper';

import {
  useGetChatUserMutation,
  addChatToUser,
  socket,
} from '../Store/StoreInterface';
import useBackButtonHandler from '../Hooks/useBackButtonHandler';
function ChatRoom() {
  const handleBackButton = useBackButtonHandler();
  handleBackButton();

  const dispatch = useDispatch();
  const theme = useTheme();

  const chatObj = useSelector(state => state.chat);
  const chat_with_id = useSelector(state => state.config.selectedUserToChat);
  const user = useSelector(state => state.user);

  const [receiverUserCleaned, setReceiverUserCleaned] = useState();
  const [isInitial, setIsInitial] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [msg, setMsg] = useState('');

  const [getChatForUserMutation, getChatForUserResponse] =
    useGetChatUserMutation();

  useEffect(() => {
    const [rUser] = Object.entries(chatObj).filter(
      chtObj => chtObj[0] === chat_with_id,
    );

    setReceiverUserCleaned({
      id: rUser[0],
      username: rUser[1].username,
      chat: rUser[1].chat.map((cht, index) => {
        return {...cht, index};
      }),
    });
  }, [chatObj]);

  useEffect(() => {
    if (receiverUserCleaned && user && isInitial) {
      getChatForUserMutation({
        user_id: user.id,
        chat_with_id: receiverUserCleaned.id,
      });
    }
  }, [user, receiverUserCleaned]);

  useEffect(() => {
    if (
      !getChatForUserResponse.isLoading &&
      !getChatForUserResponse.isUninitialized
    ) {
      if (getChatForUserResponse.isError) {
        // Handle error
      } else {
        if (getChatForUserResponse.data === null) {
          dispatch(
            addChatToUser({
              user_id: receiverUserCleaned.id,
              chat: [],
            }),
          );
        } else {
          console.log(getChatForUserResponse);
          dispatch(
            addChatToUser({
              user_id: receiverUserCleaned.id,
              chat: [...getChatForUserResponse.data],
            }),
          );
        }
        setIsInitial(false);
      }
    }
  }, [getChatForUserResponse]);

  const flatListRef = useRef(null);

  useEffect(() => {
    flatListRef.current.scrollToEnd({animated: true});
  }, [receiverUserCleaned?.chat, newMessage]);

  useEffect(() => {
    flatListRef.current.scrollToEnd({animated: true});
  }, []);

  useEffect(() => {
    if (
      receiverUserCleaned !== undefined &&
      msg !== undefined &&
      receiverUserCleaned !== null &&
      receiverUserCleaned !== null
    ) {
      socket.on('message', message => {
        //sender_id,message,time
        if (receiverUserCleaned) {
          const msgArr = message.split(',');
          const user_id = msgArr[0];
          const chatObj = {msg: msgArr[1], time: msgArr[2]};
          dispatch(
            addChatToUser({
              user_id: Number(user_id),
              chat: [{msg: msgArr[1], time: Number(msgArr[2])}],
            }),
          );
          setMsg({
            id: Number(user_id),
            msg: msgArr[1],
            time: Number(msgArr[2]),
            index: receiverUserCleaned.chat.length,
          });
        } else {
          console.error('receiverUserCleaned is undefined');
        }
      });
    }
  }, [receiverUserCleaned]);
  
  useEffect(() => {
    if (
      receiverUserCleaned !== undefined &&
      receiverUserCleaned !== null &&
      msg !== undefined &&
      msg !== null
    ) {
      setReceiverUserCleaned({
        ...receiverUserCleaned,
        chat: [...receiverUserCleaned.chat, {...msg, index: msg.index}],
      });
    }
  }, [msg]);

  const renderItem = ({item}) => {
    const isCurrentUser = Number(item.id) === Number(user.id);
    console.log(item, isCurrentUser);

    return (
      <Card
        style={{
          margin: 10,
          padding: 10,
          backgroundColor: isCurrentUser
            ? theme.colors.primary
            : theme.colors.background,
          alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
        }}>
        <Card.Content>
          <Title
            style={{
              color: isCurrentUser ? 'white' : 'black',
              fontSize: 16, // Adjust the font size as needed
              fontWeight: 'bold', // Ensure the text is bold
            }}>
            {receiverUserCleaned
              ? isCurrentUser
                ? user.username
                  ? user.username
                  : 'Admin'
                : receiverUserCleaned.username
              : ''}
          </Title>
          <Paragraph style={{color: isCurrentUser ? 'white' : 'black'}}>
            {item.msg}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const handleSendMessage = () => {
    const time = Date.now();
    const message = `${user.id},${receiverUserCleaned.id},${newMessage},${time}`;
    socket.emit('message', message);
    setNewMessage(''); // Clear the input field after sending
    dispatch(
      addChatToUser({
        user_id: receiverUserCleaned.id,
        chat: [{id: user.id, msg: newMessage, time}],
      }),
    );
    setMsg({
      id: user.id,
      msg: newMessage,
      time: time,
      index: receiverUserCleaned.chat.length,
    });
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={flatListRef}
        data={receiverUserCleaned?.chat || []}
        renderItem={renderItem}
        keyExtractor={item => item.index.toString()}
        scrollEnabled={true}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: theme.colors.surface,
          borderRadius: 10,
        }}>
        <TextInput
          style={{
            flex: 1,
            marginRight: 10,
            borderRadius: 10,
          }}
          value={newMessage}
          onChangeText={text => setNewMessage(text)}
          placeholder="Type your message..."
        />
        <Button
          mode="contained"
          onPress={handleSendMessage}
          style={{backgroundColor: 'black'}}>
          Send
        </Button>
      </View>
    </View>
  );
}

export default ChatRoom;
