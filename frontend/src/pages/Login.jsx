import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo_niji.png";


export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("auth/login/", form);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/");
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
            <img
                src={logo}
                alt="Niji logo"
                style={styles.logoImg}
            />
        </div>

        <h3 style={styles.title}>Đăng nhập</h3>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          placeholder="Username"
          onChange={e => setForm({ ...form, username: e.target.value })}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Mật khẩu"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button style={styles.button} onClick={login}>
          Đăng nhập
        </button>

        <p style={styles.registerText}>
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" style={styles.link}>
            Đăng ký ngay
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
  logo: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
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
  registerText: {
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
};
