import { useState, useEffect } from "react";
import "./UserProfile.css";
import axios from "axios";

function UserProfile({ userDetails }) {

  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isModelopen, setModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    birthday: "",
    message: "",
    email: "",
    imageUrl: "",
  });


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/server/advance_function/getReminder");
      console.log("Response data",response.data)
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUserData = {
      userId: userDetails.userid,
      name: formData.name,
      birthday: formData.birthday,
      message: formData.message,
      email: formData.email,
      imageUrl: formData.imageUrl,
    }
    try {
      const response = await axios.post("/server/advance_function/insertReminder", currentUserData);
      console.log(response);
      alert("Reminder added successfully!");
      window.location.reload();
      fetchUsers();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (id) => {
    console.log(users);
    const userToEdit = users.find((user) => user.ID === id);
    console.log(userToEdit);
   
    setEditData({ ...userToEdit });
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  }

  const handleUpdate = async () => {
    try {
      await axios.put("/server/advance_function/updateReminder", editData);
      alert("User updated successfully!");
      setEditData(null);
      window.location.reload();
      
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };



  const handleDelete = async (id) => {
    console.log("ID  :", id);
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const deleteResponse = await axios.delete(`/server/advance_function/deleteReminder/${id}`);
        console.log("Delete response :", deleteResponse);
        setUsers(users.filter((user) => user.ID !== id));
        alert("User deleted successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleChangeEditData = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggle = async (ID, checked) => {
    console.log("111");
    const AutoSendStatus = checked ? "enable" : "disable";
    console.log(`User ID: ${ID}, New AutoSend value: ${AutoSendStatus}`);
    
  
    const data = {
      id: ID,
      status: AutoSendStatus, 
    };
  
    try {
   
      const toggleRes = await axios.patch("/server/advance_function/toggleAutoSend", data);
      console.log("Toggle Response: ", toggleRes);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.ID === ID ? { ...user, AutoSend: checked } : user
        )
      );
     
    } catch (error) {
      console.error("Error toggling the user:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="Header">
        <h1>Birthday Reminder</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthday">Birthday Date</label>
            <input
              type="date"
              id="birthday"
              max={new Date().toISOString().split("T")[0]}
              value={formData.birthday}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <input
              type="text"
              id="message"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        

        <div className="submit-form">
          <button className="submit-btn" type="submit">
            Submit
          </button>
        </div>
    </form>

      <div className="user-list-container">
        {users.map((user) => (
          <div className="users-lists" key={user.ID}>
            <div className="left-content">
              <span className="name">{user.Name}</span>
              <span className="date">{user.BirthDay}</span>
              <span className="message">{user.Message}</span>
              <span className="email">{user.Email}</span>
            </div>
            <div className="right-button">
            <label className="switch">
                <input
                  type="checkbox"
                  checked={user.AutoSend} 
                  onChange={(e) => handleToggle(user.ID, e.target.checked)} 
                />
                <span className="slide round"></span>
            </label>
              <button className="edit-btn" onClick={() => handleEdit(user.ID)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(user.ID)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModelopen && (
  <div className="modal">
    <div className="modal-content">
      <span className="modal-close" onClick={closeModal}>&times;</span>
      <h2 className="modal-header">Edit</h2>

      <div className="modal-input-group">
        <label htmlFor="name" className="modal-label">Name:</label>
        <input 
  type="text"
  id="name"
  name="Name"
  value={editData?.Name || ""}
  onChange={handleChangeEditData}
  required
  className="modal-input"
/>
      </div>

      <div className="modal-input-group">
        <label htmlFor="message" className="modal-label">Message:</label>
        <input
          type="text"
          id="message"
          name="Message"
          value={editData?.Message || ""}
          onChange={handleChangeEditData}
          required
          className="modal-input"
        />
      </div>

      <div className="modal-input-group">
        <label htmlFor="bday" className="modal-label">Birthday Date</label>
        <input 
          type="date"
          id="bday"
          name="BirthDay"
          value={editData?.BirthDay || ""}
          onChange={handleChangeEditData}
          required
          className="modal-input"
        />
      </div>

      <div className="modal-input-group">
        <label htmlFor="email" className="modal-label">Email</label>
        <input
          type="email"
          id="email"
          name="Email"
          value={editData?.Email || ""}
          onChange={handleChangeEditData}
          required
          className="modal-input"
        />
      </div>

      <div className="modal-submit">
        <button className="modal-button" onClick={handleUpdate}>Update</button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default UserProfile;