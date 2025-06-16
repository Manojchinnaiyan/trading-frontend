import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const { message, type, duration = 5000 } = event.detail;

      const notification: Notification = {
        id: Math.random().toString(36).substring(2),
        message,
        type,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto remove notification
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, duration);
      }
    };

    window.addEventListener(
      "showNotification",
      handleNotification as EventListener
    );

    return () => {
      window.removeEventListener(
        "showNotification",
        handleNotification as EventListener
      );
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-success-500 text-white";
      case "error":
        return "bg-danger-500 text-white";
      case "warning":
        return "bg-warning-500 text-white";
      case "info":
      default:
        return "bg-primary-500 text-white";
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-center justify-between p-4 rounded-lg shadow-lg 
            transition-all duration-300 transform animate-slide-up
            ${getNotificationStyles(notification.type)}
          `}
        >
          <div className="flex items-center space-x-3">
            {getNotificationIcon(notification.type)}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>

          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
