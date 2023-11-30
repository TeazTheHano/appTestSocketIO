import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import io from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // const newSocket = io('http://localhost:3111',);
    const newSocket = io("27.72.88.46:3111",)

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket.IO connected');
    });

    socket.on('message', (message) => {
      console.log('Received message:', message);
      setReceivedMessage(message);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);


  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      socket.emit('message', message, (ack) => {
        if (ack) {
          console.log('Message sent successfully');
          setMessage('');
        } else {
          console.error('Failed to send message');
        }
      });
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Socket.IO Example</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
        placeholder="Enter message"
        value={message}
        onChangeText={(text) => setMessage(text)}
      />
      <Button title="Send Message" onPress={sendMessage} />
      <Text>Received Message: {receivedMessage}</Text>
    </View>
  );
};

export default App;
