import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, LogOut, Menu, CheckCircle2, MessageSquare, Clock, RotateCw } from "lucide-react";
import "./TopBar.css";
import API from "../api/api";

export default function TopBar({
  searchQuery,
  setSearchQuery,
  currentUser,
  onLogout,
  onToggleSidebar
}) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const notifRef = useRef(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 350);
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    }
    if (showNotif) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotif]);

  // Fetch notifications when TopBar loads
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get("/notification");

        console.log(
          "Notifications from backend:",
          response.data?.data || response.data
        );

        if (response.data && Array.isArray(response.data.data)) {
          setNotifications(response.data.data);
        } else if (Array.isArray(response.data)) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching notifications:",
          error.response?.data || error.message
        );
      }
    };

    fetchNotifications();
  }, []);

  const notifCount = notifications.length;
  const displayCount = notifCount > 99 ? "99+" : notifCount;

  const initials = currentUser
    ? `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`
    : "";

  return (
    <header className="topbar-container">

      <div className="topbar-left">

        <button
          type="button"
          className="btn-mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Open sidebar navigation"
        >
          <Menu size={22} />
        </button>

        <div className="search-box">
          <Search className="search-box-icon" />

          <input
            type="text"
            placeholder="Search tasks..."
            className="search-box-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      </div>

      <div className="topbar-right">
        {/* Quick Refresh Page & Data Button */}
        <button
          type="button"
          className={`refresh-btn-wrapper ${isRefreshing ? "spinning" : ""}`}
          onClick={handleRefresh}
          aria-label="Refresh page and data"
          title="Refresh Page & Data"
        >
          <RotateCw size={18} className={isRefreshing ? "spin-icon" : ""} />
        </button>

        {/* Notification Bell Section with Anchor */}
        <div className="notif-wrapper-anchor" ref={notifRef}>
          <button
            type="button"
            className={`bell-icon-wrapper ${showNotif ? "active" : ""}`}
            onClick={() => setShowNotif(!showNotif)}
            aria-label="View notifications"
            title="Notifications"
          >
            <Bell size={20} />

            {notifCount > 0 && (
              <span className="bell-badge">
                {displayCount}
              </span>
            )}
          </button>

          {/* Enhanced Notification Dropdown Menu */}
          {showNotif && (
            <div className="notif-menu">

              <div className="notif-header">
                <div className="notif-header-title">
                  <span>Notifications</span>
                  {notifCount > 0 && (
                    <span className="notif-count-chip">{notifCount} New</span>
                  )}
                </div>
              </div>

              <div className="notif-list-container">
                {notifCount === 0 ? (
                  <div className="notif-empty-state">
                    <div className="notif-empty-icon">
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="notif-empty-title">All caught up!</span>
                    <span className="notif-empty-desc">No new notifications at this time.</span>
                  </div>
                ) : (
                  notifications.map((notification, idx) => (
                    <div
                      className="notif-item"
                      key={notification._id || idx}
                    >
                      <div className="notif-item-icon">
                        <MessageSquare size={14} />
                      </div>
                      <div className="notif-item-content">
                        <p className="notif-item-text">
                          {notification.message || notification.text || JSON.stringify(notification)}
                        </p>
                        <span className="notif-item-time">
                          <Clock size={11} />
                          <span>
                            {notification.createdAt
                              ? new Date(notification.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : "Recent alert"}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

        {/* User */}
        <div className="user-info">

          <div className="avatar">
            {initials}
          </div>

          <div className="user-name">
            {currentUser
              ? `${currentUser.firstName} ${currentUser.lastName}`
              : "User"}
          </div>

        </div>

        {/* Logout */}
        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
          title="Log out"
        >
          <LogOut size={16} />
          <span className="logout-btn-text">
            Logout
          </span>
        </button>

      </div>

    </header>
  );
}