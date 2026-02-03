import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import PostItem from "../components/PostItem";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    api.get(`/posts/${id}/`)
      .then(res => setPost(res.data))
      .catch(() => navigate(-1));
  }, [id, navigate]);

  const close = () => navigate(-1);

    const submitComment = async () => {
    if (!comment.trim()) return;

    const tempComment = {
        id: `temp-${Date.now()}`,
        content: comment,
        user: {
        username: "Bạn",      // hoặc currentUser.username
        avatar: null,
        },
        created_at: "Vừa xong",
        isTemp: true,
    };

    // 1️⃣ Optimistic update
    setPost(prev => ({
        ...prev,
        comments: [...prev.comments, tempComment],
    }));

    setComment("");

    try {
        const res = await api.post(`/posts/${id}/comment/`, {
        content: tempComment.content,
        });

        // 2️⃣ Replace temp comment bằng comment thật từ server
        setPost(prev => ({
        ...prev,
        comments: prev.comments.map(c =>
            c.id === tempComment.id ? res.data : c
        ),
        }));

    } catch (err) {
        console.error(err);

        // 3️⃣ Rollback nếu lỗi
        setPost(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== tempComment.id),
        }));
    }
    };


  if (!post) return null;

  return (
    <div style={overlay} onClick={close}>
      <div style={modal} onClick={e => e.stopPropagation()}>

        {/* ===== Header ===== */}
        <div style={modalHeader}>
          <span style={title}>Bài viết</span>
          <button style={closeBtn} onClick={close}>×</button>
        </div>

        {/* ===== Scrollable content ===== */}
        <div style={modalBody}>
          <PostItem post={post} defaultShowComments />
        </div>

        {/* ===== Fixed comment input ===== */}
        <div style={commentBar}>
          <input
            style={commentInput}
            placeholder="Viết bình luận..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitComment()}
          />
          <button style={sendBtn} onClick={submitComment}>
            Gửi
          </button>
        </div>

      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: 56,
  zIndex: 999,
};

const modal = {
  width: "100%",
  maxWidth: 720,
  height: "85vh",
  marginTop: 30,
  background: "#f0f2f5",
  borderRadius: 18,
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column",
};

const modalHeader = {
  height: 56,
  padding: "0 16px",
  borderBottom: "1px solid #e4e6eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#fff",
  borderTopLeftRadius: 18,
  borderTopRightRadius: 18,
};

const title = {
  fontWeight: 600,
  fontSize: 16,
};

const closeBtn = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "none",
  background: "#e4e6eb",
  fontSize: 22,
  cursor: "pointer",
};

const modalBody = {
  flex: 1,
  overflowY: "auto",
  padding: 16,
};

/* ===== Comment bar ===== */

const commentBar = {
  display: "flex",
  gap: 10,
  padding: 12,
  borderTop: "1px solid #e4e6eb",
  background: "#fff",
  borderBottomLeftRadius: 18,
  borderBottomRightRadius: 18,
};

const commentInput = {
  flex: 1,
  height: 40,
  borderRadius: 20,
  border: "1px solid #ccd0d5",
  padding: "0 14px",
  outline: "none",
  fontSize: 14,
};

const sendBtn = {
  padding: "0 16px",
  borderRadius: 20,
  border: "none",
  background: "#1877f2",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};
