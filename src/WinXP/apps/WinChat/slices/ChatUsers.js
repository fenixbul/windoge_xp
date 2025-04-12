import React from 'react';

function ChatUsers({ users }) {
  return (
    <div className='users-wrap custom-scrollbar'>
      {users.map((user, index) => (
        <div key={index}>@{user}</div>
      ))}
    </div>
  );
}

export default ChatUsers;
