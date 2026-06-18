import React from "react";

function UserCount({ usersCount = 0 }) {
  return (
    <div style={{ marginBottom: "20px", fontWeight: "bold" }} data-testid="user-count">
      {usersCount} user(s) already registered
    </div>
  );
}

export default UserCount;
