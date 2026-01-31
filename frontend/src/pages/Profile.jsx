import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import defaultAvatar from "../assets/default_avt.jpg";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  const navigate = useNavigate();
  const { username } = useParams();

  const isOwnProfile = user?.is_self;

  const loadProfile = async () => {
    try {
      const url = username ? `auth/${username}/` : "auth/me/";
      const res = await api.get(url);

      setUser(res.data);
      setIsFollowing(res.data.is_following ?? false);
    } catch {
      alert("Không tìm thấy người dùng");
    }
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  const handleToggleFollow = async () => {
    if (loadingFollow || !user) return;

    setLoadingFollow(true);

    try {
      if (isFollowing) {
        await api.delete(`social/unfollow/${user.id}/`);
      } else {
        await api.post(`social/follow/${user.id}/`);
      }

      setIsFollowing(!isFollowing);

      setUser((prev) => ({
        ...prev,
        followers_count: prev.followers_count + (isFollowing ? -1 : 1),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollow(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.profileCard}>
        <img
          src={user.avatar || user.avatar_url || defaultAvatar}
          alt="avatar"
          style={styles.avatar}
        />

        <div style={styles.info}>
          {/* 👉 Click tên → sang profile */}
          <h2
            style={{ ...styles.name, cursor: "pointer" }}
            onClick={() => navigate(`/users/${user.username}`)}
          >
            {user.full_name || user.username}
          </h2>

          <p
            style={{ ...styles.username, cursor: "pointer" }}
            onClick={() => navigate(`/users/${user.username}`)}
          >
            @{user.username}
          </p>

          {user.bio && <p style={styles.bio}>{user.bio}</p>}

          {isOwnProfile ? (
            <button
              style={styles.editBtn}
              onClick={() => navigate("/profile/edit")}
            >
              Chỉnh sửa hồ sơ
            </button>
          ) : (
            <button
              style={isFollowing ? styles.unfollowBtn : styles.followBtn}
              onClick={handleToggleFollow}
              disabled={loadingFollow}
            >
              {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statItem}>
          <strong>{user.post_count || 0}</strong>
          <span>Bài viết</span>
        </div>

        <div
          style={styles.statItem}
          onClick={() => navigate(`/followers/${user.username}`)}
        >
          <strong>{user.followers_count}</strong>
          <span>Người theo dõi</span>
        </div>

        <div
          style={styles.statItem}
          onClick={() => navigate(`/following/${user.username}`)}
        >
          <strong>{user.following_count}</strong>
          <span>Đang theo dõi</span>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3>Bài viết</h3>
        <p style={{ color: "#777" }}>Chưa có bài viết nào.</p>
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

  followBtn: {
    padding: "8px 16px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },

  unfollowBtn: {
    padding: "8px 16px",
    background: "#e5e7eb",
    color: "#111827",
    border: "1px solid #d1d5db",
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

  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    fontSize: 15,
  },

  content: {
    marginTop: 24,
    padding: 24,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
};
