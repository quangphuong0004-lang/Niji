import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

export default function Sidebar({ onCreate }) {
  const [active, setActive] = useState("home");
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();

  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();

  const menu = [
    { key: "home",   icon: "bi-house-door", label: "Trang chủ",  path: "/" },
    { key: "create", icon: "bi-plus-square", label: "Tạo",       path: "/create" },
    { key: "search", icon: "bi-search",      label: "Tìm kiếm",  path: "/search" },
    { key: "noti",   icon: "bi-bell",        label: "Thông báo", path: null },
  ];

  return (
    <aside style={styles.sidebar}>
      {menu.map((item) => (
        <div
          key={item.key}
          onClick={() => {
            setActive(item.key);
            if (item.key === "create") {
              onCreate?.();
            } else if (item.key === "noti") {
              setShowNotif(prev => !prev);
            } else if (item.key === "home") {
              setShowNotif(false);
              sessionStorage.removeItem("home_scroll_pos"); 
              window.location.href = "/";  
            } else {
              setShowNotif(false);
              navigate(item.path);
            }
          }}
          style={{
            ...styles.menuItem,
            ...(active === item.key ? styles.activeItem : {}),
            position: "relative",
          }}
        >
          <i className={`bi ${item.icon}`} style={styles.icon} />
          <span>{item.label}</span>

          {/* Badge số thông báo chưa đọc */}
          {item.key === "noti" && unreadCount > 0 && (
            <span style={styles.badge}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}

          {/* Dropdown thông báo */}
          {item.key === "noti" && showNotif && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAllRead={markAllRead}
              onMarkOneRead={markOneRead}  // ← thêm prop
              onClose={() => setShowNotif(false)}  // ← đóng dropdown sau khi click
            />
          )}
        </div>
      ))}
    </aside>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    top: 100,
    left: 32,
    width: 260,
    height: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingTop: 8,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "14px 18px",
    borderRadius: 14,
    cursor: "pointer",
    fontSize: 17,
    transition: "0.25s",
  },
  activeItem: { background: "#f3f4f6" },
  icon: { fontSize: 22 },
  badge: {
    marginLeft: "auto",
    background: "#ef4444",
    color: "#fff",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    padding: "2px 7px",
    minWidth: 20,
    textAlign: "center",
  },
};