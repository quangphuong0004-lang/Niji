import { useState } from "react";
import api from "../services/api";

export default function EditPostModal({ post, onClose, onUpdated }) {
  const [content, setContent] = useState(post.content);
  const [oldImages, setOldImages] = useState(post.images || []);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===== Remove old image ===== */
  const removeOldImage = (imgId) => {
    setOldImages(prev => prev.filter(img => img.id !== imgId));
    setDeletedImages(prev => [...prev, imgId]);
  };

  /* ===== Add new images ===== */
  const handleAddImages = (e) => {
    setNewImages(prev => [...prev, ...Array.from(e.target.files)]);
  };

  /* ===== Submit ===== */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);

      newImages.forEach(img => {
        formData.append("images", img);
      });

      formData.append(
        "removed_images",
        JSON.stringify(deletedImages)
        );

      await api.put(`/posts/${post.id}/update/`, formData);

      onUpdated(content);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Chỉnh sửa bài viết</h3>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={textarea}
        />

        {/* ===== OLD IMAGES ===== */}
        {oldImages.length > 0 && (
          <div style={imageGrid}>
            {oldImages.map(img => (
              <div key={img.id} style={imageWrapper}>
                <img src={img.image} alt="" style={image} />
                <span
                  style={removeBtn}
                  onClick={() => removeOldImage(img.id)}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ===== NEW IMAGE PREVIEW ===== */}
        {newImages.length > 0 && (
          <div style={imageGrid}>
            {newImages.map((img, i) => (
              <div key={i} style={imageWrapper}>
                <img
                  src={URL.createObjectURL(img)}
                  alt=""
                  style={image}
                />
              </div>
            ))}
          </div>
        )}

        {/* ===== ADD IMAGE BUTTON ===== */}
        <label style={addImageBtn}>
          <i className="bi bi-image" style={{ fontSize: 20 }} />
          <input
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={handleAddImages}
          />
        </label>

        {/* ===== ACTIONS ===== */}
        <div style={actions}>
          <button onClick={onClose} style={cancelBtn}>Hủy</button>
          <button onClick={handleSubmit} style={saveBtn} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modal = {
  background: "#fff",
  borderRadius: 14,
  padding: 20,
  width: "100%",
  maxWidth: 520,
};

const textarea = {
  width: "100%",
  minHeight: 120,
  padding: 0,
  border: "1px solid #ddd",
  marginBottom: 10,
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 14,
};

const saveBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

const cancelBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
};

const imageGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
  gap: 10,
  marginTop: 10,
};

const imageWrapper = {
  position: "relative",
};

const image = {
  width: "100%",
  height: 100,
  objectFit: "cover",
  borderRadius: 8,
};

const removeBtn = {
  position: "absolute",
  top: 6,
  right: 6,
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  borderRadius: "50%",
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 14,
};

const addImageBtn = {
  marginTop: 10,
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
