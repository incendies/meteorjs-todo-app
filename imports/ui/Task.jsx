import React from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

export const Task = ({ task }) => {
  const toggleChecked = () => {
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  };

  const handleRemove = async () => {
    try {
      await Meteor.callAsync('tasks.remove', task._id);
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  return (
    <li className={classnames({
      'checked': task.checked,
    })}>
      <button className="delete" onClick={handleRemove}>
        &times;
      </button>

      <input
        type="checkbox"
        readOnly
        checked={!!task.checked}
        onClick={toggleChecked}
      />

      <span className="text">{task.text}</span>
    </li>
  );
};
