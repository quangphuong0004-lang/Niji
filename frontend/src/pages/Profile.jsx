import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import defaultAvatar from "../assets/default_avt.jpg";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => {
        alert("Chưa đăng nhập");
      });
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Header profile */}
      <div style={styles.profileCard}>
        <img
          src={user.avatar_url || defaultAvatar}
          alt="avatar"
          style={styles.avatar}
        />

        <div style={styles.info}>
          <h2 style={styles.name}>
            {user.full_name || user.username}
          </h2>

          <p style={styles.username}>@{user.username}</p>

          {user.bio && <p style={styles.bio}>{user.bio}</p>}

          <button
            style={styles.editBtn}
            onClick={() => navigate("/profile/edit")}
          >
            Chỉnh sửa hồ sơ
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div>
          <strong>0</strong>
          <span>Bài viết</span>
        </div>
        <div>
          <strong>0</strong>
          <span>Người theo dõi</span>
        </div>
        <div>
          <strong>0</strong>
          <span>Đang theo dõi</span>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3>Bài viết</h3>
        <p style={{ color: "#777" }}>
          Chưa có bài viết nào.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "32px 24px",
    paddingTop: 96,          
    paddingLeft: 300,        
    fontFamily: "Arial, Helvetica, sans-serif",
  },

 profileCard: {
    display: "flex",
    gap: 32,
    padding: 32,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #6366f1",
  },

  info: {
    flex: 1,
  },

  name: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
  },

  username: {
    color: "#6b7280",
    marginBottom: 8,
  },

  bio: {
    marginBottom: 12,
  },

  editBtn: {
    padding: "8px 14px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },

  stats: {
    marginTop: 24,
    display: "flex",
    justifyContent: "space-between",
    background: "#fff",
    padding: "20px 32px",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },

  content: {
    marginTop: 24,
    padding: 24,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
};
