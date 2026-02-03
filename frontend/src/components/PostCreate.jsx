import { useState } from "react";
import api from "../services/api";

export default function PostCreate({ onCreated }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);
      images.forEach(img => formData.append("images", img));

      await api.post("/posts/create/", formData);

      setContent("");
      setImages([]);
      onCreated?.();
    } catch (err) {
      console.error(err);
      alert("Đăng bài thất bại");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={box}>
      {/* Text */}
      <textarea
        placeholder="Bạn đang nghĩ gì?"
        value={content}
        onChange={e => setContent(e.target.value)}
        style={textarea}
      />

      {/* Preview images */}
      {images.length > 0 && (
        <div style={previewWrap}>
          {images.map((img, idx) => (
            <div key={idx} style={previewItem}>
              <img
                src={URL.createObjectURL(img)}
                alt=""
                style={previewImg}
              />

              <button
                onClick={() => removeImage(idx)}
                style={removeBtn}
                title="Xóa ảnh"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={actions}>
        <label style={imageBtn}>
          <i className="bi bi-image" style={{ fontSize: 20 }} />
          <input
            type="file"
            multiple
            hidden
            onChange={e => setImages([...e.target.files])}
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...submitBtn,
            ...(loading ? submitDisabled : {}),
          }}
        >
          {loading ? "Đang đăng..." : "Đăng"}
        </button>
      </div>
    </div>
  );
}


const box = {
  background: "#fff",
  padding: 16,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
};

const textarea = {
  width: "100%",
  minHeight: 100,
  border: "1px solid #e5e7eb",
  padding: 0,
  fontSize: 15,
  resize: "none",
  outline: "none",
};

const previewWrap = {
  display: "flex",
  gap: 10,
  marginTop: 12,
  overflowX: "auto",
};

const previewItem = {
  position: "relative",
};

const previewImg = {
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

const removeBtn = {
  position: "absolute",
  top: -6,
  right: -6,
  width: 22,
  height: 22,
  borderRadius: "50%",
  border: "none",
  background: "#000",
  color: "#fff",
  fontSize: 14,
  cursor: "pointer",
  lineHeight: "22px",
};

const actions = {
  marginTop: 14,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const imageBtn = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const submitBtn = {
  background: "#000",
  color: "#fff",
  border: "none",
  padding: "10px 22px",
  borderRadius: 999,
  fontWeight: 600,
  cursor: "pointer",
};

const submitDisabled = {
  opacity: 0.6,
  cursor: "not-allowed",
};