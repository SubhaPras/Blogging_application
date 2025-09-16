import React, { useEffect, useState } from "react";
import axios from "axios";
import {toast} from 'react-toastify'
import "./Users.css";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/allUsers", {
        withCredentials: true,
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/admin/user/delete/${selectedUser}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message)
        setUsers(users.filter((user) => user._id !== selectedUser));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowDialog(false);
      setSelectedUser(null);
    }
  };

  // Handle Block
 const handleBlock = async (userId) => {
  try {
    const res = await axios.post(
      `http://localhost:3000/api/admin/blockuser/${userId}`,
      {},
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message || "Failed to block user");
    }
  } catch (error) {
    console.error("Error blocking user:", error.message);
    toast.error("Something went wrong!");
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-users-container">
      <h2 className="heading">All Users</h2>

      {loading ? (
        <p className="loading">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="no-users">No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      setSelectedUser(user._id);
                      setShowDialog(true);
                    }}
                  >
                    Delete
                  </button>
                  <button className="block-btn" onClick={() => { handleBlock(user._id);}}>Block</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="dialog-actions">
              <button onClick={handleDelete} className="confirm-btn">
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
