import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments, faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const socket = io('https://dcchatserver.herokuapp.com/', { transports: ['websocket']});

function App() {
  const loginInput = useRef(null);
  const chatInput = useRef(null);
  const invisibleDiv = useRef(null);

  const [chats, setChats] = useState([]);

  const [name, setName] = useState('');

  useEffect(() => {
    if(name.length <= 0) return;
    
    socket.emit('userJoined', name);

    socket.on('userJoined', (response) => {
      setChats(chat => [...chat, {
        name: response.name,
        time: `${response.timestamp.data} at ${response.timestamp.time}`,
        message: response.message
      }]);

      invisibleDiv.current.scrollIntoView()
    })

    socket.on('messageReceived', (response) => {
      setChats(chat => [...chat, {
        name: response.name,
        time: `${response.timestamp.data} at ${response.timestamp.time}`,
        message: response.message
      }]);
      
      invisibleDiv.current.scrollIntoView()
    })
  }, [name])

  const sendChat = () => {
    const msg = chatInput.current.value;
    if(!msg.trim()) return;

    socket.emit('messageSent', msg);
    chatInput.current.value = '';
  }

  const submitLogin = () => {
    const name = loginInput.current.value;

    if(!name.trim()) return;
    
    setName(name);
  }

  const ChatComponent = () => {
    return (
      <div className="chatContainer">
        <div className="chatLeftSide">
          <div className="chatLeftSideHeader">
            <h1 className="chatLetSideHeaderName">Lets Talk</h1>
            <FontAwesomeIcon color='white' size="2x" icon={faComments} />
          </div>
          <div className="chatLeftSideBody">
            
          </div>
          <div className="chatLeftSideFooter">
            <p>Made by Harley with </p>
            <FontAwesomeIcon color='white' size=".1x" icon={faHeart} />
          </div>
        </div>
        <div className="chatRightSide">
          <div className="chatScrollViewContainer">
            {
              chats.map(chat => (
                <div className={"chatMessageContainer"}>
                  <div className={"ChatMessageHeader"}>
                    <p className={"chatMessageName"}>{chat.name}</p>
                    <p className={"chatMessageDot"}> &#8226;</p>
                    <p className={"chatMessageTime"}>{chat.time}</p>
                  </div>
                  <p>{chat.message}</p>
                </div>
              ))
            }
            <div ref={invisibleDiv}></div>
          </div>
          <div className="chatInputContainer">
            <input className="chatInput" ref={chatInput}/>
            <button className="chatButton" onClick={sendChat}>
              <FontAwesomeIcon color='black' size=".1x" icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const LoginComponent = () => {
    return (
      <div className="loginContainer">
        <div className="loginContainerInputContainer">
          <div className="loginLogoContainer">
            <h1 className="chatLetSideHeaderName">Lets Talk</h1>
            <FontAwesomeIcon color='#802bb1' size="2x" icon={faComments} />
          </div>
          <p>Enter name: </p>
          <input ref={loginInput} maxlength="10" className={"loginInput"} />
        </div>
        <button onClick={submitLogin} className="loginButton"> 
          <p>Submit</p>
        </button>
      </div>
    )
  }

  return (
    <div className="App">
      { name.length > 0 ? <ChatComponent /> : <LoginComponent /> }
    </div>
  );
}

export default App;
