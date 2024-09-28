import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Tasks } from '/imports/api/tasks.js';
import { Task } from './Task.jsx';
import { AccountsUIWrapper } from './AccountsUIWrapper.jsx';

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
  const [newTask, setNewTask] = useState("");

  const user = useTracker(() => Meteor.user());

  const tasksSubscription = useTracker(() => {
    return Meteor.subscribe('tasks');
  });

  const tasks = useTracker(() => {
    if (hideCompleted) {
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } }).fetch();
    }
    return Tasks.find({}, { sort: { createdAt: -1 } }).fetch();
  });

  const incompleteCount = useTracker(() => 
    Tasks.find({ checked: { $ne: true } }).count()
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    Meteor.call('tasks.insert', newTask.trim());

    setNewTask("");
  };

  const toggleHideCompleted = () => {
    setHideCompleted(!hideCompleted);
  };

  return (
    <div className="container">
      <header>
        <h1>Todo List ({incompleteCount})</h1>

        <label className="hide-completed">
          <input
            type="checkbox"
            readOnly
            checked={hideCompleted}
            onClick={toggleHideCompleted}
          />
          Hide Completed Tasks
        </label>

        <AccountsUIWrapper />

        { user ? (
          <form className="new-task" onSubmit={handleSubmit} >
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Type to add new tasks"
            />
          </form>
        ) : ''}
      </header>

      <ul>
        {tasks.map(task => (
          <Task key={task._id} task={task} />
        ))}
      </ul>
    </div>
  );
};
