
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CommentSection from "./CommentSection";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: 8 }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{post.title}</h2>
          <p>{post.content}</p>
          <p style={{ fontSize: "0.8rem", color: "#777" }}>
            Publicado em {new Date(post.created_at).toLocaleString()}
          </p>
          <CommentSection postId={post.id} />
        </div>
      ))}
    </div>
  );
}
