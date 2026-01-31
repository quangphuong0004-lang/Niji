import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import defaultAvatar from "../assets/default_avt.jpg";

export default function FollowersPage() {
  const { username } = useParams();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/social/followers/${username}/`)
      .then((res) => setUsers(res.data))
      .catch(() => alert("Không tải được danh sách"));
  }, [username]);

  return (
    <div style={styles.container} onClick={() => navigate(-1)}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>Người theo dõi</h2>

          <button
            style={styles.closeBtn}
            onClick={() => navigate(-1)}
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div style={styles.body}>
          {users.length === 0 ? (
            <div style={styles.empty}>Chưa có người theo dõi</div>
          ) : (
            users.map(({ id, follower }) => (
              <div
                key={id}
                style={styles.user}
                onClick={() => navigate(`/users/${follower.username}`)}
              >
                <img
                  src={follower.avatar_url || defaultAvatar}
                  alt=""
                  style={styles.avatar}
                />

                <div>
                  <strong>
                    {follower.full_name || follower.username}
                  </strong>
                  <p style={{ margin: 0, color: "#666" }}>@{follower.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    zIndex: 999,
    fontFamily: "Arial",
  },

  card: {
    width: 500,
    height: 560,

    background: "#fff",
    borderRadius: 28, 
    overflow: "hidden", 

    display: "flex",
    flexDirection: "column",

    boxShadow: "0 30px 80px rgba(0,0,0,0.35)", 
  },

  header: {
    padding: "20px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    borderBottom: "1px solid #f1f1f1",
    background: "#fff",

    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  body: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 18px",

    scrollBehavior: "smooth",
  },

  closeBtn: {
    border: "none",
    background: "#f3f4f6",
    width: 38,
    height: 38,
    borderRadius: "50%",

    cursor: "pointer",
    fontSize: 17,
    fontWeight: "bold",

    transition: "0.2s",
  },

  user: {
    display: "flex",
    gap: 12,                 
    alignItems: "center",

    padding: 12,             
    borderRadius: 14,        
    cursor: "pointer",
    marginBottom: 8,         

    background: "#f9fafb",
    transition: "all 0.18s ease",
  },

  avatar: {
    width: 46,              
    height: 46,
    borderRadius: "50%",
    objectFit: "cover",
  },

  empty: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#6b7280",
    fontSize: 15,
  },
};
