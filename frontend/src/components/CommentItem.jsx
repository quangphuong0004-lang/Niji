import defaultAvatar from "../assets/default_avt.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

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

export default function CommentItem({ comment }) {
  if (!comment || !comment.user) return null; // ✅ tránh crash khi data lỗi

  const navigate = useNavigate();
  const { id: postId } = useParams();
  const isReply = Boolean(comment.parent);

  const [openMenu, setOpenMenu] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  /* ===== DELETE ===== */
  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      await api.delete(`/posts/comment/${comment.id}/delete/`);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Không thể xóa bình luận");
    }
  };

  /* ===== REPLY ===== */
  const handleReply = async () => {
    if (!replyText.trim() || !postId) return;

    try {
      await api.post(`/posts/${postId}/comment/`, {
        content: replyText.trim(),
        parent: comment.id,
      });

      setReplyText("");
      setShowReply(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Không thể trả lời");
    }
  };

  return (
    <div style={{ ...commentWrap, marginLeft: isReply ? 36 : 0 }}>
      {isReply && <div style={replyLine} />}

      <div style={commentBox}>
        <img
          src={comment.user.avatar_url || defaultAvatar}
          alt=""
          style={avatar}
          onClick={() => navigate(`/users/${comment.user.username}`)}
        />

        <div style={commentContent}>
          <div style={header}>
            <strong
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/users/${comment.user.username}`)}
            >
              {comment.user.username}
            </strong>

            <span style={time}>{timeAgo(comment.created_at)}</span>

            {comment.is_owner && (
              <span style={dots} onClick={() => setOpenMenu((v) => !v)}>
                ⋯
              </span>
            )}

            {openMenu && (
              <div style={menu}>
                <div style={menuItem} onClick={handleDelete}>
                  Xóa
                </div>
              </div>
            )}
          </div>

          <p style={text}>{comment.content}</p>

          {/* ===== REPLY BUTTON ===== */}
          <span
            style={{
              ...replyBtn,
              marginLeft: isReply ? 6 : 0, 
              fontSize: isReply ? 12 : 13,
            }}
            onClick={() => setShowReply((v) => !v)}
          >
            Trả lời
          </span>

          {showReply && (
            <div style={replyBox}>
              <input
                style={replyInput}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Viết trả lời..."
              />
              <button
                style={replySend}
                disabled={!replyText.trim()}
                onClick={handleReply}
              >
                Gửi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== CHILD REPLIES ===== */}
      {(comment.replies || []).map((r) => (
        <div key={r.id} style={{ marginTop: 8 }}>
          <CommentItem comment={r} />
        </div>
      ))}
    </div>
  );
}

/* ===== STYLES ===== */

const commentWrap = {
  position: "relative",
  marginBottom: 16,
  fontFamily:
    "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const commentBox = {
  display: "flex",
  gap: 10,
  alignItems: "flex-start",
};

const avatar = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  objectFit: "cover",
  flexShrink: 0,
};

const commentContent = {
  background: "#f0f2f5",
  padding: "8px 12px",
  borderRadius: 14,
  maxWidth: "85%",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 4,
};

const time = {
  fontSize: 12,
  color: "#65676b",
};

const text = {
  fontSize: 14,
  margin: 0,
  color: "#1c1e21",
  lineHeight: 1.45,
  wordBreak: "break-word",
};

const replyLine = {
  position: "absolute",
  left: -18,
  top: 0,
  bottom: 0,
  width: 2,
  background: "#d0d3d8",
  borderRadius: 2,
};

/* ===== MENU STYLES ===== */

const dots = {
  cursor: "pointer",
  fontSize: 18,
  padding: "0 6px",
  userSelect: "none",
};

const menu = {
  position: "absolute",
  top: 22,
  right: 0,
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  overflow: "hidden",
  zIndex: 10,
};

const menuItem = {
  padding: "8px 14px",
  fontSize: 14,
  cursor: "pointer",
  color: "#e41e3f",
};

const replyBtn = {
  fontSize: 13,
  color: "#65676b",
  cursor: "pointer",
  marginTop: 6,
  display: "inline-block",
};

/* ===== REPLY INPUT ===== */
const replyBox = {
  display: "flex",
  gap: 6,
  marginTop: 6,
};

const replyInput = {
  flex: 1,
  padding: "6px 10px",
  borderRadius: 16,
  border: "1px solid #ccd0d5",
  outline: "none",
};

const replySend = {
  padding: "6px 12px",
  borderRadius: 16,
  border: "none",
  background: "#1877f2",
  color: "#fff",
  cursor: "pointer",
};
