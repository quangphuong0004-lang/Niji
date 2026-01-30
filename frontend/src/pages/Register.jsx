import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo_niji.png";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await api.post("auth/register/", form);
      alert("Đăng ký thành công");
      navigate("/login");
    } catch (err) {
      setError("Thông tin đăng ký không hợp lệ");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <img src={logo} alt="Niji logo" style={styles.logoImg} />
        </div>

        <h3 style={styles.title}>Đăng ký</h3>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Username"
          onChange={e => setForm({ ...form, username: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Mật khẩu"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button style={styles.button} onClick={submit}>
          Đăng ký
        </button>

        <p style={styles.loginText}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={styles.link}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  card: {
    width: 360,
    background: "#fff",
    padding: "32px 28px",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  logoWrapper: {
    height: 80,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoImg: {
    height: 230,
    objectFit: "contain",
  },
  title: {
    marginBottom: 20,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 16,
    fontSize: 14,
  },
  link: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "bold",
  },
  error: {
    color: "#ef4444",
    marginBottom: 10,
  },
};
