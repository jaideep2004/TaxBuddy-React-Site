import React from 'react'

const Topbar = ({ handleLogout }) => {
    return (
      <div className="topbar">
        <div>
          
        </div>
        
        <button onClick={handleLogout}>Logout</button>
        
      </div>
    );
  }; 

export default Topbar