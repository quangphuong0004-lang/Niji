import { useNavigate } from "react-router-dom";
import PostCreate from "../components/PostCreate";

export default function CreatePost() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <h3>Tạo bài viết</h3>

        <PostCreate
          onCreated={() => {
            navigate("/"); 
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    paddingTop: 96,
    paddingLeft: 300,
    display: "flex",
    justifyContent: "center",
  },
  box: {
    width: "100%",
    maxWidth: 620,
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
};