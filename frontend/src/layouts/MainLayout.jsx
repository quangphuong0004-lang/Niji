import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <Navbar />

      <div style={styles.wrapper}>
        <Sidebar />

        <main style={styles.main}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

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