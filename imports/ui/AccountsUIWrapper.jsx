import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';

export const AccountsUIWrapper = () => {
  const user = useTracker(() => Meteor.user());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const logout = () => Meteor.logout();
  
  const login = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    // Check if the user exists, if not create one
    Meteor.call('checkUserExists', username, (error, exists) => {
      if (error) {
        console.error("Error checking user:", error);
        alert(`Error checking user: ${error.message}`);
        return;
      }

      if (!exists) {
        Accounts.createUser({ username, password }, (error) => {
          if (error) {
            console.error("Error creating user:", error);
            alert(`Error creating user: ${error.reason}`);
          } else {
            console.log("User created successfully");
            performLogin(username, password);
          }
        });
      } else {
        performLogin(username, password);
      }
    });
  };

  const performLogin = (username, password) => {
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        console.error("Login error", error);
        alert(`Login error: ${error.reason}`);
      } else {
        console.log("Login successful");
        setUsername('');
        setPassword('');
      }
    });
  };

  if (user) {
    return (
      <div>
        <span>Hello, {user.username}!</span>
        <button onClick={logout}>Logout</button>
      </div>
    );
  } else {
    return (
      <form onSubmit={login}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login/Register</button>
      </form>
    );
  }
};