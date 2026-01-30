import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import defaultAvatar from "../assets/default_avt.jpg";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    bio: "",
  });

  const [dob, setDob] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(defaultAvatar);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load profile
  useEffect(() => {
    api
      .get("auth/me/")
      .then((res) => {
        setForm({
          full_name: res.data.full_name || "",
          bio: res.data.bio || "",
        });

        if (res.data.date_of_birth) {
          const [y, m, d] = res.data.date_of_birth.split("-");
          setDob({ day: d, month: m, year: y });
        }

        if (res.data.avatar_url) {
          setPreview(res.data.avatar_url);
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const submit = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("full_name", form.full_name);
      data.append("bio", form.bio);

      if (dob.day && dob.month && dob.year) {
        data.append("date_of_birth", `${dob.year}-${dob.month}-${dob.day}`);
      }

      if (avatar) {
        data.append("avatar", avatar);
      }

      await api.patch("auth/me/update-profile/", data);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/profile");
      }, 1200);
    } catch {
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.title}>Chỉnh sửa hồ sơ</h2>

        {/* Avatar */}
        <div style={styles.avatarBox}>
          <img src={preview} alt="avatar" style={styles.avatar} />
          <label style={styles.uploadBtn}>
            Chọn ảnh
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAvatar(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </div>

        {/* Họ tên */}
        <div style={styles.field}>
          <label style={styles.label}>Họ và tên</label>
          <input
            style={styles.input}
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
          />
        </div>

        {/* Bio */}
        <div style={styles.field}>
          <label style={styles.label}>Giới thiệu</label>
          <textarea
            style={styles.textarea}
            value={form.bio}
            onChange={(e) =>
              setForm({ ...form, bio: e.target.value })
            }
          />
        </div>

        {/* DOB */}
        <div style={styles.field}>
          <label style={styles.label}>Ngày sinh</label>
          <div style={styles.dobRow}>
            <input
              style={styles.dobInput}
              placeholder="Ngày"
              value={dob.day}
              onChange={(e) =>
                setDob({ ...dob, day: e.target.value })
              }
            />
            <input
              style={styles.dobInput}
              placeholder="Tháng"
              value={dob.month}
              onChange={(e) =>
                setDob({ ...dob, month: e.target.value })
              }
            />
            <input
              style={styles.dobInput}
              placeholder="Năm"
              value={dob.year}
              onChange={(e) =>
                setDob({ ...dob, year: e.target.value })
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            style={styles.cancelBtn}
            onClick={() => navigate("/profile")}
          >
            Hủy
          </button>

          <button
            style={styles.saveBtn}
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {success && (
        <div style={styles.overlay}>
          <div style={styles.toast}>
            Cập nhật hồ sơ thành công
          </div>
        </div>
      )}
    </>
  );
}


const styles = {
  container: {
    maxWidth: 480,
    margin: "35px auto",
    padding: 24,
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
    marginLeft: 600,
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  title: {
    textAlign: "center",
    marginBottom: 20,
  },

  avatarBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 24,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #6366f1",
    marginBottom: 10,
  },

  uploadBtn: {
    cursor: "pointer",
    fontSize: 14,
    color: "#6366f1",
    fontWeight: 600,
  },

  field: {
    marginBottom: 14,
  },

  label: {
    marginBottom: 6,
    display: "block",
    fontSize: 13,
    fontWeight: 600,
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  textarea: {
    width: "100%",
    height: 90,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    resize: "none",
  },

  dobRow: {
  display: "flex",
  gap: 8,
  },

  dobInput: {
    flex: 1,
    minWidth: 0,          
    width: "100%",        
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
    boxSizing: "border-box",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
  },

  cancelBtn: {
    background: "#e5e7eb",
    border: "none",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
  },

  saveBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  toast: {
    background: "#fff",
    padding: "16px 24px",
    borderRadius: 12,
    fontWeight: 600,
    color: "#16a34a",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
};
