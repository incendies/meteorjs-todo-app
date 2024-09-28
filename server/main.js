import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername('testuser')) {
    Accounts.createUser({
      username: 'testuser',
      password: 'testpassword'
    });
  }
});
