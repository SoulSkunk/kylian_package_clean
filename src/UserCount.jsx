import axios from 'axios';
import { useState, useEffect } from 'react';

function UserCount() {
  const port = import.meta.env.VITE_SERVER_PORT || 8000;
  let [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    async function countUsers() {
      try {
        const api = axios.create({
          baseURL: `http://localhost:${port}`
        });
        const response = await api.get('/users');
        setUsersCount(response.data.utilisateurs.length);
      } catch (error) {
        console.error(error);
      }
    }
    countUsers();
  }, [port]);

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h2>Users manager</h2>
      <p>{usersCount} user(s) already registered</p>
    </div>
  );
}

export default UserCount;
