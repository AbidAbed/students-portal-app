const express = require("express");
const app = express();
const PORT = 4000;
const axios = require('axios');
const apiUrl = "http://localhost:3000/user/chat";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//👇🏻 New imports
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "<http://localhost:4000>",
  },
});

let connectedClients = [];
//👇🏻 Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`A user connected`);

  socket.on("message", (message) => {
    console.log(message);
    //sender_id,receiver_id,message,time
    const msgArr = message.split(",");
    const msgObj = {
      sender_id: msgArr[0],
      reciever_id: msgArr[1],
      message: msgArr[2],
      time: msgArr[3],
    };
    const [desiredSocket] = connectedClients.filter(
      (usr) => usr.id === msgObj.reciever_id
    );
    if (desiredSocket) {
      const messageToBeSent = `${msgObj.sender_id},${msgObj.message},${msgObj.time}`;
      desiredSocket.socket.emit("message", messageToBeSent);
    }

    axios
      .post(apiUrl, {
        id: msgObj.sender_id,
        msg: msgObj.message,
        time: msgObj.time,
        sender_id: msgObj.sender_id,
        chat_with_id: msgObj.reciever_id,
      })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });

    axios
      .post(apiUrl, {
        id: msgObj.reciever_id,
        msg: msgObj.message,
        time: msgObj.time,
        sender_id: msgObj.sender_id,
        chat_with_id: msgObj.sender_id,
      })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  });
  socket.on("regUserId", (message) => {
    if (!connectedClients.find((usr) => usr.id === message)) {
      connectedClients.push({ id: message, socket });
      socket.id = message;
    }
    console.log("Connected clients", connectedClients);
  });
  socket.on("disconnect", () => {
    socket.disconnect();

    connectedClients = connectedClients.filter((usr) => usr.id !== socket.id);
    console.log("Connected clients", connectedClients);
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
