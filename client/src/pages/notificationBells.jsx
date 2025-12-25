import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("USER ID RECEIVED =", userId);
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/notifications?userId=${userId}`)
      .then((res) => {
        console.log("NOTIFICATION RESPONSE =", res.data);
        setNotifications(res.data);
      })
      .catch(console.error);
  }, [userId]);

  const markRead = (id) => {
    axios
      .put("http://localhost:5000/api/notifications/read", {
        notificationId: id,
      })
      .then(() =>
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id ? { ...n, read: true } : n
          )
        )
      )
      .catch(console.error);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* BELL BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "relative",
          background: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
        }}
      >
        🔔

        {/* RED BADGE */}
        {notifications.filter((n) => !n.read).length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              fontSize: "12px",
              padding: "2px 6px",
              borderRadius: "50%",
              fontWeight: "bold",
            }}
          >
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {/* DROPDOWN LIST */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "35px",
            right: "0",
            width: "320px",
            maxHeight: "420px",
            overflowY: "auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
            animation: "fadeDown 0.25s ease-out",
            padding: "10px 0",
            zIndex: 100,
          }}
        >
          {/* NO NOTIFICATIONS */}
          {notifications.length === 0 ? (
            <p
              style={{
                padding: "14px",
                textAlign: "center",
                color: "#888",
                fontSize: "14px",
              }}
            >
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markRead(n._id)}
                style={{
                  padding: "12px 16px",
                  margin: "6px 10px",
                  borderRadius: "10px",
                  backgroundColor: n.read
                    ? "#f4f4f4"
                    : "#e7faff",
                  border: "1px solid #e0e0e0",
                  cursor: "pointer",
                  transition: "0.2s",
                  boxShadow: n.read
                    ? "none"
                    : "0px 2px 6px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: n.read ? "normal" : "600",
                    color: "#333",
                  }}
                >
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
