import CommentItem from "./CommentItem";

export default function CommentList({ comments, onDelete  }) {
  if (!comments || comments.length === 0) {
    return (
      <div style={empty}>
        Chưa có bình luận nào
      </div>
    );
  }

  return (
    <div style={commentWrapper}>
      {comments.map(c => (
        <CommentItem
          key={c.id}
          comment={c}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

/* ===== styles ===== */

const commentWrapper = {
  marginTop: 14,
  padding: "14px 16px",
  border: "1px solid #e4e6eb",
  borderRadius: 14,
  background: "#fff",
};

const empty = {
  marginTop: 14,
  padding: 16,
  textAlign: "center",
  color: "#65676b",
  fontSize: 14,
};
