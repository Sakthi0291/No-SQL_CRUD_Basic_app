import React from 'react'
import { useState } from 'react'
import './AddTask.css'
import axios from 'axios';
export default function AddTask() {

  const [userID, setUserID] = useState('');
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('High');
  const [status, setStatus] = useState('Pending');
  const today = new Date().toISOString().split('T')[0];

  const addTask = async(event) => {
    event.preventDefault();

    const newTask = {
      userID,
      taskName,
      dueDate,
      priority,
      status
    };
    await axios.post("/server/react_in_catalyst_function/addtask",newTask).then((res) => {
       window.confirm("Task added successfully");
       clearForm();
    }).catch(function (error) {
      alert(error.message);
    });
  };

  const clearForm = () => {
    setUserID('');
    setTaskName('');
    setDueDate('');
    setPriority('High');
    setStatus('Pending');
  };

  return (
    <>
    <div className="container my-4">
      {/* Add To-Do Item Form */}
      <div className="card my-4">
        <div className="card-header">
          <h2>Add New Task</h2>
        </div>

        <div className="card-body">
          <form onSubmit={addTask}>
            {/* Task Name and User ID */}
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label htmlFor="userID" className="userID">User ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="userID"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="taskName">Task Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="taskName"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Due Date, Priority, and Status */}
            <div className="form-row align-items-center">
                <div className="col-md-4 mb-3">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={today} // This restricts past dates
                    required
                  />
            </div>     

              <div className="col-md-4 mb-3">
                <label htmlFor="priority">Priority</label>
                <select
                  className="form-control"
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="status-cls">
                <label htmlFor="status" >Status</label>
                <select
                  className="form-control"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="buttons mt-4">
              <button type="submit" className="btn btn-primary">
                Add Task
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearForm}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
