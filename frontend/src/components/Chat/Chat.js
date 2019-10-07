import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'; 


import Msgs from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css';

let sockets;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'https://ma9-reactchatapp.herokuapp.com/';
  
  useEffect(()=>{
    const {name, room} = queryString.parse(location.search);

    sockets = io(ENDPOINT);

    setName(name);
    setRoom(room); 

    sockets.emit('join',{
      name,
      room
    }, () => {
      
    });
    

    return() => {
      sockets.emit('disconnect');
      sockets.off();
    }
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    sockets.on('message',(message) => {
      setMessages([...messages, message]);
    })

    sockets.on('roomData', ({ users }) => {
      setUsers(users);
    })

    return () => {
      sockets.emit('disconnect');

      sockets.off();
    }

  },[messages] );

  const sendMessage = (event) => {
    event.preventDefault();
    
    if(message){
      sockets.emit('sendMessage', message, () => setMessage(''));
    }
  }

  console.log(message, messages);

  return(
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={ room }/>
        <Msgs messages={ messages } name={ name } />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;