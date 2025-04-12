/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from 'react';
import { createActor as createChatActor } from '../../../declarations/chat';
import { WinChatWrap } from './WinChatStyles';
import ChatMessages from './slices/ChatMessages';
import ChatUsers from './slices/ChatUsers';
import ChatInput from './slices/ChatInput';
import { useAuth } from 'context/AuthContext';
import ChatLoginModal from './slices/ChatLoginModal';
import classNames from 'classnames';
import ChatCreateUserModal from './slices/ChatCreateUserModal';
import ChatWindowDropDowns from './slices/ChatWindowDropDowns';
import { useGeneralContext } from 'context/GeneralContext';

import {
  refreshUserActivity,
  fetchCurrentUser,
  getActiveUsers,
  sendMessage
} from './chatService';
import { AnonymousIdentity } from '@dfinity/agent';

function WinChat({ onClose, onMinimize }) {
  const { isAuthenticated, identity, logout } = useAuth();
  const { createActorInstance } = useGeneralContext();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [chatActor, setChatActor] = useState(null);

  const chatActorRef = useRef(null);
  const currentUserRef = useRef(null);
  const isAuthenticatedRef = useRef(null);

  const chatMessagesRef = useRef(null);

  const anonymousChatActor = createActorInstance(
    process.env.REACT_APP_CHAT_CANISTER_ID,
    new AnonymousIdentity(),
    createChatActor
  );

  useEffect(() => {
    chatActorRef.current = chatActor;
  }, [chatActor]);

  useEffect(() => {
    currentUserRef.current = currentUser;
    getActiveUsers(anonymousChatActor, currentUserRef.current).then(setUsers);
  }, [currentUser]);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    const activeUsersInterval = setInterval(() => getActiveUsers(anonymousChatActor, currentUserRef.current).then(setUsers), 10 * 1000);
    const userActivityInterval = setInterval(() => refreshUserActivity(chatActorRef.current, currentUserRef.current, isAuthenticatedRef.current), 60 * 1000);

    return () => {
      clearInterval(userActivityInterval);
      clearInterval(activeUsersInterval);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && identity) {
      const actor = createActorInstance(
        process.env.REACT_APP_CHAT_CANISTER_ID,
        identity,
        createChatActor
      );
      setChatActor(actor);
    } else {
      setChatActor(null);
    }
  }, [isAuthenticated, identity]);

  useEffect(() => {
    if (isAuthenticated && chatActor) {
      fetchCurrentUser(chatActor).then((user) => {
        if (!user) {
          setShowCreateUserModal(true);
        } else {
          setCurrentUser(user);
        }
      });
    } else {
      setCurrentUser(null);
    }
  }, [isAuthenticated, chatActor]);

  useEffect(() => {
    if(currentUserRef.current) {
      refreshUserActivity(chatActor, currentUserRef.current, isAuthenticatedRef.current);
    }
  }, [currentUserRef.current]);

  useEffect(() => {
    if(isAuthenticated) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated]);

  const handleInputFocusChange = (focused) => {
    if (focused && !isAuthenticated) setShowLoginModal(true);
  };

  const handleSendMessage = (text) => {
    const message = {
      content: text,
      sender: currentUserRef.current.id,
      timestamp: BigInt(new Date().getTime() * 1e6),
    };
  
    sendMessage(chatActor, message, chatMessagesRef.current.setMessages);
  };

  const handleLogout = async () => {
    if (chatActor) await Promise.all([chatActor.leaveChannel(), logout()]);
    getActiveUsers(anonymousChatActor, null).then(setUsers);
    setShowCreateUserModal(false);
  };

  const handleOnCloseCreateUserModal = (user) => {
    setCurrentUser(user);
    setShowCreateUserModal(false)
  }

  return (
    <WinChatWrap>
      <ChatWindowDropDowns setShowLoginModal={setShowLoginModal} onLogout={handleLogout} />
      {showLoginModal && <ChatLoginModal onClose={() => setShowLoginModal(false)} />}
      {showCreateUserModal && <ChatCreateUserModal onClose={handleOnCloseCreateUserModal} chatActor={chatActor} />}
      <div className={classNames('winchat-content', { blur: showLoginModal || showCreateUserModal })}>
        <ChatMessages ref={chatMessagesRef} chatActor={chatActor} anonymousChatActor={anonymousChatActor} currentUserRef={currentUserRef} />
        <ChatUsers users={users} />
        <ChatInput onSendMessage={handleSendMessage} onFocusChange={handleInputFocusChange} />
      </div>
    </WinChatWrap>
  );
}

export default WinChat;
