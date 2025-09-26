import React, { useState, useEffect } from 'react';

interface NotificationProps {
  message: string | null;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2700); // Start fade-out before it's removed from App state
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-gray-100 text-gray-900 text-lg font-semibold shadow-2xl transition-all duration-300 ease-in-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};

export default Notification;
