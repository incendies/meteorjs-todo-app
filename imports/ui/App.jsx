import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Tasks } from '/imports/api/tasks.js';
import { Task } from './Task.jsx';
// Remove or comment out this line
// import { AccountsUIWrapper } from './AccountsUIWrapper';

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
  const [newTask, setNewTask] = useState("");

  const { tasks, incompleteCount, isLoading } = useTracker(() => {
    const subscription = Meteor.subscribe('tasks');
    const isLoading = !subscription.ready();

    const tasksCursor = hideCompleted 
      ? Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } })
      : Tasks.find({}, { sort: { createdAt: -1 } });

    return {
      tasks: tasksCursor.fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
      isLoading
    };
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newTask.trim()) {
      alert('Please enter a task');
      return;
    }

    try {
      const result = await Meteor.callAsync('tasks.insert', newTask.trim());
      console.log('Task added successfully:', result);
      setNewTask("");
    } catch (error) {
      console.error('Error inserting task:', error);
      alert(`Could not add task: ${error.reason || error.message || 'Unknown error'}`);
    }
  };

  const toggleHideCompleted = () => setHideCompleted(!hideCompleted);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container">
      <header>
        {/* Remove or comment out this line */}
        {/* <AccountsUIWrapper /> */}
        <h1>Todo List ({incompleteCount})</h1>

        <label className="hide-completed">
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={toggleHideCompleted}
          />
          Hide Completed Tasks
        </label>

        <form className="new-task" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Type to add new tasks"
          />
          <button type="submit">Add Task</button>
        </form>
      </header>

      <ul>
        {tasks.map(task => (
          <Task 
            key={task._id} 
            task={task}
          />
        ))}
      </ul>
    </div>
  );
};
