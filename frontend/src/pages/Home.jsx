import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import PostItem from "../components/PostItem";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [showTabs, setShowTabs] = useState(true);

  const lastScrollY = useRef(0);

  const loadPosts = async (currentTab = tab) => {
    try {
      setLoading(true);

      const url =
        currentTab === "feed"
          ? "/posts/feed/"
          : "/posts/";

      const res = await api.get(url);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      alert("Không tải được feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(tab);
  }, [tab]);

  useEffect(() => {
  const handleScroll = () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScrollY.current) {
      setShowTabs(false);
    } else {
      setShowTabs(true);
    }

    lastScrollY.current = currentScroll;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.feed}>

        <div
          style={{
            ...styles.tabsWrapper,
            transform: showTabs ? "translateY(0)" : "translateY(-120%)",
            opacity: showTabs ? 1 : 0,
          }}
        >
          <div style={styles.tabs}>
            <div
              onClick={() => setTab("all")}
              style={{
                ...styles.tab,
                ...(tab === "all" ? styles.activeTab : {}),
              }}
            >
              Dành cho bạn
            </div>

            <div
              onClick={() => setTab("feed")}
              style={{
                ...styles.tab,
                ...(tab === "feed" ? styles.activeTab : {}),
              }}
            >
              Đang theo dõi
            </div>
          </div>
        </div>

        <div style={styles.posts}>
          {loading && <p>Đang tải bài viết...</p>}

          {!loading && posts.length === 0 && (
            <p style={{ color: "#777" }}>
              {tab === "feed"
                ? "Chưa có bài viết từ người bạn theo dõi"
                : "Chưa có bài viết nào"}
            </p>
          )}

          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onReload={() => loadPosts(tab)}
            />
          ))}
        </div>

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
    width: "100%",
  },

  feed: {
    width: "100%",
    maxWidth: 720,
    background: "#fff",
    padding: "24px 28px",
    borderRadius: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  tabsWrapper: {
    position: "relative",
    transition: "all 0.25s ease",
    marginBottom: 16,
  },

  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    padding: 6,
    background: "#fff",
  },

  tab: {
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    padding: "8px 20px",
    borderRadius: 999,
    color: "#555",
    transition: "0.25s",
  },

  activeTab: {
    background: "#000",
    color: "#fff",
  },

  posts: {
    transition: "0.25s",
  },
};
