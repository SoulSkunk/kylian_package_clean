import { useState, useEffect } from 'react';

function UserCount() {
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    function updateCount() {
      const registration = localStorage.getItem('registration');
      if (registration) {
        setUsersCount(1);
      } else {
        setUsersCount(0);
      }
    }
    
    updateCount();
    
    // Optional: listen to custom event to update in real-time if necessary,
    // though the prompt just says 'récupérer la liste des utilisateurs inscrits depuis le localstorage'
    window.addEventListener('storage', updateCount);
    
    return () => {
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <h2>Users manager</h2>
      <p>{usersCount} user(s) already registered</p>
    </div>
  );
}

export default UserCount;
