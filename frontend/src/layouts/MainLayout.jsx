import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCreate from "../components/PostCreate";
import { Outlet } from "react-router-dom";
import { useState } from "react";


const styles = {
  wrapper: {
    display: "flex",
    gap: 32,
    padding: "24px 32px",
    minHeight: "calc(100vh - 80px)",
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },
};
export default function MainLayout() {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <>
      <Navbar />

      <div style={styles.wrapper}>
        <Sidebar onCreate={() => setOpenCreate(true)} />

        <main style={styles.main}>
          <Outlet />
        </main>
      </div>

      {/* ===== CREATE POST MODAL ===== */}
      {openCreate && (
        <div style={overlay} onClick={() => setOpenCreate(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={header}>
              <h3>Tạo bài viết</h3>
              <button
                style={closeBtn}
                onClick={() => setOpenCreate(false)}
              >
                ✕
              </button>
            </div>

            <PostCreate onCreated={() => setOpenCreate(false)} />
          </div>
        </div>
      )}
    </>
  );
}
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(5px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  width: "100%",
  maxWidth: 520,
  background: "#fff",
  borderRadius: 20,
  padding: 20,
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const closeBtn = {
  background: "transparent",
  border: "none",
  fontSize: 22,
  cursor: "pointer",
};