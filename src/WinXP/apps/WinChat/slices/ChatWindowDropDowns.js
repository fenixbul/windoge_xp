import { WindowDropDowns } from 'components';
import { useAuth } from 'context/AuthContext';
import React from 'react';

function ChatWindowDropDowns({ setShowLoginModal, onLogout }) {
  const { isAuthenticated, logout } = useAuth();

  // Dropdown Items with conditional rendering
  const dropdownItems = {
    "Account": isAuthenticated
      ? [
          { type: 'item', text: 'Wallet', disable: true }, 
          { type: 'item', text: 'Profile', disable: true },
          { type: 'item', text: 'Logout' },
        ]
      : [
          { type: 'item', text: 'Login' }, // Login at the top if not authenticated
          { type: 'item', text: 'Wallet', disable: true },
        ],
    "Channels": [
      { type: 'item', text: 'Show Channels', disable: true},
      { type: 'item', text: 'Create Channel', disable: true}
    ],
    "Help": [
      { type: 'item', text: 'About', disable: true}
    ]
  };

  // Handle dropdown item clicks
  function onClickOptionItem(item) {
    switch (item) {
      case 'Login':
        setShowLoginModal(true);
        break;
      case 'Logout':
        onLogout();
        break;
      default:
    }
  }

  return (
    <section>
      <div className='dropdown-menu'>
        <WindowDropDowns
          items={dropdownItems}
          onClickItem={onClickOptionItem}
          height={21}
        />
      </div>
    </section>
  );
}

export default ChatWindowDropDowns;
