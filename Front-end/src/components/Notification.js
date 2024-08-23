import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/ticket/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {Array.isArray(notifications) && notifications.length > 0 ? (
        notifications.map(notification => (
          <div key={notification.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
            <p className="text-gray-800">{notification.message}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 italic">No notifications</p>
      )}
    </div>
  );
};

export default Notifications;
