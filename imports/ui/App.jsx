import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Tasks } from '/imports/api/tasks.js';

export const App = () => {
  const [newTask, setNewTask] = useState('');
  
  const tasks = useTracker(() => Tasks.find({}, { sort: { createdAt: -1 } }).fetch());

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newTask) return;

    Tasks.insert({
      text: newTask.trim(),
      createdAt: new Date(),
    });

    setNewTask('');
  };

  const toggleChecked = ({ _id, isChecked }) => {
    Tasks.update(_id, {
      $set: {
        isChecked: !isChecked,
      },
    });
  };

  const deleteTask = ({ _id }) => Tasks.remove(_id);

  return (
    <div>
      <h1>Todo List</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type to add new tasks"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={!!task.isChecked}
              onClick={() => toggleChecked(task)}
              readOnly
            />
            <span>{task.text}</span>
            <button onClick={() => deleteTask(task)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};