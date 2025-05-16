import React from 'react'
import { useState } from 'react'
import axios from "axios"
import './FilterTask.css'

export default function FilterTask() {

    const [tasks, setTasks] = useState([]);
    const [isModelopen, setModal] = useState(false);
    const [userData, setUserdata] = useState({
        UserID: "",
        TaskName: "",
        DueDate: "",
        Status: "",
      });
    

  const [userID, setUserID] = useState('');
  const [taskName, setTaskName] = useState('');
  const [status, setStatus] = useState('');

  const filterTasks = async () => {
    console.log("Filtering tasks with: ", { userID, taskName, status });
    await axios.get('/server/react_in_catalyst_function/filtertask', { params: { userID, taskName, status } }).then((response) => {
    console.log("RES DATA:::  ",response.data);
    setTasks(response.data);
    console.log("TASKS::: ", tasks);
    })
    .catch((err) => {
      console.log(err.response);
    });
  };


  const handleDelete = async (taskData) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user!");
    console.log("TaskID  ",taskData);
    const userID = taskData.UserID;
    const taskName = taskData.TaskName;

   if(isConfirmed)
   {
    await axios.delete(`/server/react_in_catalyst_function/deleteTask`,{ params: { userID, taskName } }).then((response) =>{
        console.log(response);
        if (window.confirm(response.data.message)) {
            window.location.reload()
        }
    });
   }
}

  const handleEdit = async (data)=>{
   console.log("Dataaa  ",data);
   setUserdata(data);
   setModal(true);
  }

  const closeModal = async () => {
    setModal(false);
  }

  const clearTask = () => {
    setUserID('');
    setTaskName('');
    setStatus('');
  };

  const handleChange = (e) =>{
    const { name, value } = e.target;
    setUserdata((prevData) => ({
        ...prevData,
        [name]: value,
    }));
  }

   const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Submitted UserData   ",userData);
    
    await axios.post("/server/react_in_catalyst_function/updatetask",userData).then((response) => {
         console.log("Response  ",response);
        if (window.confirm(response.data.message)) {
            window.location.reload()
        }
    })
  };


  return (
    <>
    
<div className="filter-tasks-container">
      <h4 className="filter-tasks-header">Filter Tasks</h4>

      <div className="form-row">
        {/* UserID  */}
        <div className="col-md-4">
          <label htmlFor="filterUserID" className="filter-label">User ID</label>
          <input
            type="text"
            className="form-control"
            id="filterUserID"
            placeholder="Enter User ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
          />
        </div>

        {/* Task Name  */}
        <div className="col-md-4">
          <label htmlFor="filterTaskName" className="filter-label">Task Name</label>
          <input
            type="text"
            className="form-control"
            id="filterTaskName"
            placeholder="Enter Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="col-md-4">
          <label htmlFor="filterStatus" className="filter-label">Status</label>
          <select
            className="form-control"
            id="filterStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" disabled hidden  className="placeholder">
      Status
    </option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Apply Filters and Clear Button */}
      <div className="btn-wraper mt-3">
        <button className="applyfilter" onClick={filterTasks}>Apply Filters</button>
        <button className="cleartask-btn" onClick={clearTask}>Clear</button>
      </div>
    </div>


 
{/* Task list */}
{tasks.length > 0 && (
       <div className='container'>
         <h2>Task List</h2>

         <table className='table'>

      <thead>
        <tr>
          <th>S. No</th>
          <th>User ID</th>
          <th>Task Name</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Update</th>
          <th>Delete</th>
        </tr>
      </thead>

      <tbody>
          {tasks && tasks.map((task, index) => {
            return(
            <tr key={index+1}>
            <td>{index+1}</td>
            <td>{task.UserID}</td>
            <td>{task.TaskName}</td>
            <td>{task.DueDate}</td>
            <td>{task.Status}</td>
            <td><button className='btn' onClick={() => handleEdit(task)}>Edit</button></td>
            <td><button className='btnDelete' onClick={()=> handleDelete(task)}>Delete</button></td>
          </tr>
            );
          })}
         
      </tbody>
        </table>
        {isModelopen && (
            <div className='modal'>
                <div className='modal-content'>
                    <span className='close' onClick={()=> closeModal()}>&times;</span>
                    <h2>User Details</h2>
   
      <div>
        <label htmlFor="userID">UserID:</label>
        <input
          type="text"
          id="userID"
          name="UserID"
          value={userData.UserID}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="taskName">TaskName:</label>
        <input
          type="text"
          id="taskName"
          name="TaskName"
          value={userData.TaskName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="dueDate">DueDate:</label>
        <input
          type="date"
          id="dueDate"
          name="DueDate"
          value={userData.DueDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]} // Prevents past dates
          required
        />
      </div>


      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="Status"
          value={userData.Status}
          onChange={handleChange}
          required
        >
          <option value="" >Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>

                </div>
            </div>
        )}
     </div>
)}
    </>
  )
}




