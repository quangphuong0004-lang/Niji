import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import logo from "../assets/logo_niji.png";
import defaultAvatar from "../assets/default_avt.jpg";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("auth/me/")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.left} onClick={() => navigate("/")}>
        <img src={logo} alt="Niji logo" style={styles.logoImg} />

      </div>

      {/* Right */}
      <div style={styles.right}>
        {!user ? (
          <>
            <button style={styles.linkBtn} onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
          </>
        ) : (
          <div style={styles.userBox}>
            <img
              src={user.avatar_url ? user.avatar_url : defaultAvatar}
              alt="avatar"
              style={styles.avatar}
              onClick={() => navigate("/profile")}
            />
            <button style={styles.logoutBtn} onClick={logout}>
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 64,
  padding: "0 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#ffffff",
  borderBottom: "1px solid #eee",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  fontFamily: "'Inter', sans-serif",
  zIndex: 1000,   // ⭐ cực kỳ quan trọng
},

  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },

  logoImg: {
    height: 120,
    objectFit: "contain",
  },

  brand: {
    fontSize: 20,
    fontWeight: 700,
    color: "#4f46e5",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  linkBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    color: "#374151",
  },

  primaryBtn: {
    padding: "8px 14px",
    background: "#6366f1",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },

  userBox: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer",
    border: "2px solid #6366f1",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
  },
};