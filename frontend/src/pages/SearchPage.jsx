import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import defaultAvatar from "../assets/default_avt.jpg";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const res = await api.get(`social/search/?q=${keyword}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Tìm kiếm người dùng</h2>

      {/* Form search */}
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="Nhập username hoặc tên..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button}>Tìm</button>
      </form>

      {/* Kết quả */}
      {loading && <p>Đang tìm kiếm...</p>}

      <div style={styles.list}>
        {users.map((user) => (
          <div
            key={user.id}
            style={styles.userItem}
            onClick={() => navigate(`/users/${user.username}`)}
          >
            <img
                src={user.avatar_url || defaultAvatar}
                alt="avatar"
                style={styles.avatar}
                />
            <div>
              <strong>{user.full_name || user.username}</strong>
              <p style={{ color: "#666" }}>@{user.username}</p>
            </div>
          </div>
        ))}

        {!loading && users.length === 0 && keyword && (
          <p style={{ color: "#888" }}>Không tìm thấy người dùng</p>
        )}
      </div>
    </div>
  );
}

const styles = {
    container: {
    paddingTop: 30,
    paddingLeft: 60,     
    paddingRight: 500,
    maxWidth: 1000,      
    margin: 0,
    fontFamily: "Arial, Helvetica, sans-serif",
    },

  form: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },

  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 16,
  },

  button: {
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  userItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 12,
    background: "#fff",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
  },
};