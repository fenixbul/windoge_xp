import React, { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext';

function ChatCreateUserModal({ onClose, chatActor }) {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState(null); // Status of username ("Available" or "Taken")
  const [isChecking, setIsChecking] = useState(false); // Loader state
  const [isCreating, setIsCreating] = useState(false); // Loader state for creation
  const [debouncedUsername, setDebouncedUsername] = useState(''); // For debounce effect

  // Debounce username input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(timer); // Clear the timer on new input
  }, [username]);

  // Check username availability whenever debouncedUsername changes
  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername.trim()) {
        setStatus('');
        return;
      }

      setIsChecking(true);
      try {
        const response = await chatActor.isUsernameFree(debouncedUsername);
        setStatus(response ? 'Available' : 'Taken');
      } catch (error) {
        alert('Error checking username:' + error.message);
        throw error;
        setStatus('Error checking username');
      } finally {
        setIsChecking(false);
      }
    };

    checkUsername();
  }, [debouncedUsername, chatActor]);

  const handleCreateUser = async () => {
    if (status !== 'Available' || !username.trim()) return;

    setIsCreating(true);
    try {
      const response = await chatActor.createUser(username.trim());
      if (response.ok) {
        // alert('User created successfully!');
        onClose(response.ok); // Close modal on success
      } else {
        alert(`Error: ${response.err}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="create-user-modal modal">
      <div className="modal-content" style={{
        padding: '5px 10px 7px 10px'
      }}>
        <div className="input-group">
          <label htmlFor="username">Username </label><br></br>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // disabled={isChecking || isCreating}
          />
          <span className={`status-message ${status === 'Available' ? 'available' : 'taken'}`} style={{
            paddingLeft: "2px",
            fontSize: 14,
            position: 'relative',
            top: '1px'
          }}>
            {isChecking ? 'Checking...' : (status === 'Available' ? '✅' : (status === 'Taken' ? '🚫' : ''))}
          </span>
        </div>
        <button
          onClick={handleCreateUser}
          disabled={status !== 'Available' || isCreating}
          className="create-user-button"
          style={{
            padding: '3px 6px',
            marginTop: '6px'
          }}
        >
          {isCreating ? 'Creating...' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}

export default ChatCreateUserModal;
