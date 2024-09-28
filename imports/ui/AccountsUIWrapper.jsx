import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

export const AccountsUIWrapper = () => {
  const user = useTracker(() => Meteor.user());

  const logout = () => Meteor.logout();
  const login = () => {
    Meteor.loginWithPassword('testuser', 'testpassword', (error) => {
      if (error) {
        console.error("Login error", error);
        alert(error.reason);
      } else {
        console.log("Login successful");
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
    return <button onClick={login}>Login</button>;
  }
};