import { useState } from "react";
import api from "../services/api";
import CommentList from "./CommentList";
import defaultAvatar from "../assets/default_avt.jpg";
import { useNavigate } from "react-router-dom";
import EditPostModal from "../pages/EditPostModal";

function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 5) return "Vừa xong";
  if (diff < 60) return `${diff} giây trước`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} phút trước`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;

  const years = Math.floor(days / 365);
  return `${years} năm trước`;
}

export default function PostItem({ post, defaultShowComments = false, onDeleteComment }) {
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post.likes_count);
  const [liked, setLiked] = useState(post.is_liked);
  const [showComments, setShowComments] = useState(defaultShowComments);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const goToProfile = () => navigate(`/users/${post.author.username}`);

  const openDetail = () => {
    sessionStorage.setItem("home_scroll_pos", window.scrollY.toString());
    navigate(`/posts/${post.id}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));
      await api.post(`/posts/${post.id}/like/`);
    } catch (err) {
      console.error(err);
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này không?")) return;
    try {
      await api.delete(`/posts/${post.id}/delete/`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  const imageCount = post.images.length;

  return (
    <div style={box}>
      {/* Header */}
      <div style={header}>
        <div style={{ display: "flex", gap: 10 }}>
          <img
            src={post.author.avatar_url || defaultAvatar}
            alt=""
            style={avatar}
            onClick={goToProfile}
          />
          <div>
            <strong style={username} onClick={goToProfile}>
              {post.author.username}
            </strong>
            <div style={time}>{timeAgo(post.created_at)}</div>
          </div>
        </div>

        {post.is_owner && (
          <div style={{ position: "relative" }}>
            <i
              className="bi bi-three-dots"
              style={moreBtn}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
            />
            {showMenu && (
              <div style={menu}>
                <div
                  style={menuItem}
                  onClick={() => {
                    setEditContent(post.content);
                    setShowEditModal(true);
                    setShowMenu(false);
                  }}
                >
                  Chỉnh sửa
                </div>
                <div style={{ ...menuItem, color: "#ef4444" }} onClick={handleDelete}>
                  Xóa
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p style={{ ...content, cursor: "pointer" }} onClick={openDetail}>
        {post.content}
      </p>

      {/* ✅ Images */}
      {imageCount > 0 && (
  <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 12,
    alignItems: "flex-start",
  }}>
    {post.images.map((img) => (
      <img
        key={img.id}
        src={img.image}
        alt=""
        style={{
          width: imageCount === 1 ? "100%" : "calc(50% - 2px)",
          maxWidth: imageCount === 1 ? 420 : "calc(50% - 2px)",
          aspectRatio: imageCount === 1 ? "auto" : "1 / 1",  
          height: imageCount === 1 ? "auto" : undefined,
          objectFit: imageCount === 1 ? "contain" : "cover", 
          display: "block",
          cursor: "pointer",
          borderRadius: 10,
        }}
        onClick={openDetail}
      />
    ))}
  </div>
)}

      {/* Actions */}
      <div style={actions}>
        <span onClick={handleLike} style={likeBtn}>
          <i
            className="bi bi-heart-fill"
            style={{ color: liked ? "#ef4444" : "#b8b8b8", fontSize: 18 }}
          />
          <span>{likes}</span>
        </span>
        <span onClick={() => setShowComments(!showComments)} style={commentBtn}>
          <i className="bi bi-chat" />
          <span>{post.comments.length}</span>
        </span>
      </div>

      {showComments && <CommentList comments={post.comments} />}

      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onUpdated={(newContent) => {
            post.content = newContent;
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}

const box = {
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  marginBottom: 20,
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
};
const header = { display: "flex", justifyContent: "space-between", marginBottom: 6 };
const avatar = { width: 40, height: 40, borderRadius: "50%", objectFit: "cover", cursor: "pointer" };
const username = { fontWeight: 600, fontSize: 14, cursor: "pointer" };
const time = { fontSize: 12, color: "#65676b" };
const content = { marginTop: 6, lineHeight: 1.6, fontSize: 15 };
const actions = { display: "flex", gap: 20, marginTop: 12 };
const likeBtn = { display: "flex", alignItems: "center", gap: 6, cursor: "pointer" };
const commentBtn = { display: "flex", alignItems: "center", gap: 6, cursor: "pointer" };
const moreBtn = { cursor: "pointer", fontSize: 18 };
const menu = {
  position: "absolute", top: 28, right: 0, minWidth: 140,
  background: "#fff", borderRadius: 10,
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden", zIndex: 100,
};
const menuItem = {
  padding: "10px 14px", fontSize: 14,
  display: "flex", alignItems: "center", gap: 10,
  cursor: "pointer", transition: "background 0.2s",
};