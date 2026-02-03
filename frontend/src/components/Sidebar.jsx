import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onCreate }) {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  const menu = [
    { key: "home", icon: "bi-house-door", label: "Trang chủ", path: "/" },
    { key: "chat", icon: "bi-chat-dots", label: "Chat", path: "/chat" },
    { key: "create", icon: "bi-plus-square", label: "Tạo", path: "/create" },
    { key: "search", icon: "bi-search", label: "Tìm kiếm", path: "/search" },
    { key: "noti", icon: "bi-bell", label: "Thông báo", path: "/notifications" },
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
            } else {
              navigate(item.path);
            }
          }}
          style={{
            ...styles.menuItem,
            ...(active === item.key ? styles.activeItem : {}),
          }}
        >
          <i className={`bi ${item.icon}`} style={styles.icon} />
          <span>{item.label}</span>
        </div>
      ))}
    </aside>
  );
}

const styles = {
  sidebar: {
  position: "fixed",
  top: 200,                
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
  activeItem: {
    background: "#f3f4f6",
  },
  icon: {
    fontSize: 22,
  },
};