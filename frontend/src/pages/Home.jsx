export default function Home() {
  return (
    <div style={styles.feed}>
      <h3>📝 Post mới</h3>
      <hr />
      <h3>📢 Feed</h3>
    </div>
  );
}

const styles = {
  feed: {
    width: "100%",
    maxWidth: 620,
    background: "#fff",
    padding: 24,
    borderRadius: 20,
  },
};