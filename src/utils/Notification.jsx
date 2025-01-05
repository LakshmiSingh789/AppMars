import React, { useEffect } from 'react';

// Notification component
const Notification = ({ type, message, onClose }) => {
  // Automatically close the notification after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Close after 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onClose]);

  // Return null if there's no message
  if (!message) return null;

  return (
    <div className={`alert ${type}`} role="alert">
      {message}
      <button type="button" className="close" onClick={onClose}>
        <span>&times;</span>
      </button>
    </div>
  );
};

export default Notification;
