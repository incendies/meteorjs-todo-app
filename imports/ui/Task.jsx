import React from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

export const Task = ({ task }) => {
  const toggleChecked = () => {
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  };

  const deleteThisTask = () => {
    Meteor.call('tasks.remove', task._id);
  };

  const togglePrivate = () => {
    Meteor.call('tasks.setPrivate', task._id, !task.private);
  };

  const currentUser = Meteor.user();
  const isOwner = task.owner === currentUser._id;

  return (
    <li className={classnames({
      'checked': task.checked,
      'private': task.private,
    })}>
      <button className="delete" onClick={deleteThisTask}>
        &times;
      </button>

      <input
        type="checkbox"
        readOnly
        checked={!!task.checked}
        onClick={toggleChecked}
      />

      { isOwner && (
        <button className="toggle-private" onClick={togglePrivate}>
          { task.private ? 'Private' : 'Public' }
        </button>
      )}

      <span className="text">
        <strong>{task.username}</strong>: {task.text}
      </span>
    </li>
  );
};
