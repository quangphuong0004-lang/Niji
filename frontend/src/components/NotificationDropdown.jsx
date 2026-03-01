import { useNavigate } from "react-router-dom";

const TYPE_TEXT = {
  like:    "đã thích bài viết của bạn",
  comment: "đã bình luận bài viết của bạn",
  follow:  "đã bắt đầu theo dõi bạn",
};

export default function NotificationDropdown({ notifications, onMarkAllRead, onMarkOneRead, onClose }) {
  const navigate = useNavigate();

  const handleClick = (n) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!n.is_read) {
      onMarkOneRead(n.id);
    }

    // Đóng dropdown
    onClose?.();

    // Redirect đúng trang
    if (n.notif_type === "follow") {
      navigate(`/users/${n.sender_username}`);
    } else {
      navigate(`/posts/${n.post_id}`);
    }
  };

  return (
    <div
      style={styles.dropdown}
      onClick={(e) => e.stopPropagation()} // ← ngăn click dropdown đóng sidebar
    >
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>Thông báo</span>
        <button onClick={onMarkAllRead} style={styles.markBtn}>
          Đánh dấu tất cả đã đọc
        </button>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>

      {/* Danh sách */}
      <div style={styles.list}>
        {notifications.length === 0 ? (
          <p style={styles.empty}>Chưa có thông báo nào</p>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              style={{
                ...styles.item,
                background: n.is_read ? "#fff" : "#f0f4ff",
              }}
            >
              <img
                src={n.sender_avatar || "/default-avatar.png"}
                style={styles.avatar}
                alt=""
              />
              <div style={{ flex: 1 }}>
                <span style={styles.bold}>{n.sender_username}</span>
                {" "}{TYPE_TEXT[n.notif_type] || n.notif_type}
                <div style={styles.time}>
                  {new Date(n.created_at).toLocaleString("vi-VN")}
                </div>
              </div>
              {!n.is_read && <div style={styles.dot} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  dropdown: {
    position: "absolute",
    top: "110%",
    left: 0,
    width: 360,
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
    zIndex: 999,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid #f0f0f0",
  },
  title: { fontWeight: 700, fontSize: 16 },
  markBtn: {
    background: "none",
    border: "none",
    color: "#6c63ff",
    cursor: "pointer",
    fontSize: 13,
  },
  list: { maxHeight: 420, overflowY: "auto" },
  empty: { textAlign: "center", padding: 24, color: "#aaa" },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    borderBottom: "1px solid #f7f7f7",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  avatar: { width: 42, height: 42, borderRadius: "50%", objectFit: "cover" },
  bold: { fontWeight: 600 },
  time: { fontSize: 12, color: "#aaa", marginTop: 2 },
  dot: {
    width: 10, height: 10,
    borderRadius: "50%",
    background: "#6c63ff",
    flexShrink: 0,
    alignSelf: "center",
  },
  closeBtn: {
  background: "#f0f0f0",
  border: "none",
  borderRadius: "50%",
  width: 28,
  height: 28,
  cursor: "pointer",
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#555",
},
};