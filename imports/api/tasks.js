import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find();
  });
}

Meteor.methods({
  async 'tasks.insert'(text) {
    check(text, String);

    // Remove the user check
    // if (!this.userId) {
    //   throw new Meteor.Error('not-authorized', 'You must be logged in to add tasks');
    // }

    try {
      const result = await Tasks.insertAsync({
        text,
        createdAt: new Date(),
        // Remove owner and username for now
        // owner: this.userId,
        // username: Meteor.users.findOne(this.userId).username,
      });
      return result;
    } catch (error) {
      throw new Meteor.Error('insert-failed', 'Failed to insert task', error);
    }
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    // Replace this line:
    // Tasks.remove(taskId);

    // With this:
    Tasks.removeAsync(taskId);
  },

  'tasks.setChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    // Replace this line:
    // Tasks.update(taskId, {
    //   $set: { isChecked },
    // });

    // With this:
    Tasks.updateAsync(taskId, {
      $set: { isChecked },
    });
  },
});
