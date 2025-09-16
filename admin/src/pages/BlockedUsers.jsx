import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./BlockedUsers.css";

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all blocked users
  const fetchBlockedUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/blockedUsers", {
        withCredentials: true,
      });
      if (res.data.success) {
        setBlockedUsers(res.data.users);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      toast.error("Failed to load blocked users");
    } finally {
      setLoading(false);
    }
  };

  // Handle Unblock
  const handleUnblock = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/admin/unblockUser/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setBlockedUsers(blockedUsers.filter((user) => user._id !== id));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Failed to unblock user");
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  return (
    <div className="blocked-users-container">
      <h2 className="heading">Blocked Users</h2>

      {loading ? (
        <p className="loading">Loading blocked users...</p>
      ) : blockedUsers.length === 0 ? (
        <p className="no-users">No blocked users.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {blockedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>
                  <button
                    className="unblock-btn"
                    onClick={() => handleUnblock(user._id)}
                  >
                    Unblock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BlockedUsers;
