import defaultAvatar from "../assets/default_avt.jpg";
import { useNavigate } from "react-router-dom";

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
  if (days < 7) return `${days} ngày trước`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} tuần trước`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;

  const years = Math.floor(days / 365);
  return `${years} năm trước`;
}

export default function CommentItem({ comment }) {
  const isReply = Boolean(comment.parent);
  const navigate = useNavigate();

  return (
    <div style={{ ...commentWrap, marginLeft: isReply ? 36 : 0 }}>
      {isReply && <div style={replyLine} />}

      <div style={commentBox}>
        <img
          src={comment.user.avatar_url || defaultAvatar}
          alt=""
          style={{ ...avatar, cursor: "pointer" }}
          onClick={() => navigate(`/users/${comment.user.username}`)}
        />

        <div style={commentContent}>
          <div style={header}>
            <span
              style={{ ...username, cursor: "pointer" }}
              onClick={() => navigate(`/users/${comment.user.username}`)}
            >
              {comment.user.username}
            </span>

            <span style={time}>
              {timeAgo(comment.created_at)}
            </span>
          </div>

          <p style={text}>{comment.content}</p>
        </div>
      </div>

      {/* Replies */}
      <div style={{ marginTop: 8 }}>
        {(comment.replies || []).map(r => (
          <CommentItem key={r.id} comment={r} />
        ))}
      </div>
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

const username = {
  fontSize: 13,
  fontWeight: 600,
  color: "#050505",
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