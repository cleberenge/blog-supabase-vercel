import PostList from "@/components/PostList";

export default function App() {
  return (
    <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Blog da Comunidade
      </h1>
      <PostList />
    </main>
  );
}
