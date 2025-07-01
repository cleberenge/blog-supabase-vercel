
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles(username)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (!error) setComments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("comments").insert([{
      post_id: postId,
      user_id: session.user.id,
      content
    }]);
    if (!error) {
      setContent("");
      fetchComments();
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3 style={{ fontWeight: "bold" }}>Comentários</h3>
      {comments.map((comment) => (
        <div key={comment.id} style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
          <p>{comment.content}</p>
          <small>{comment.profiles?.username || "Usuário"} — {new Date(comment.created_at).toLocaleString()}</small>
        </div>
      ))}

      {session ? (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Escreva um comentário..."
            style={{ width: "100%", padding: "0.5rem", borderRadius: 4 }}
          />
          <button type="submit" style={{ marginTop: "0.5rem", padding: "0.5rem 1rem" }}>
            Comentar
          </button>
        </form>
      ) : (
        <p style={{ fontSize: "0.9rem", color: "#555" }}>Faça login para comentar.</p>
      )}
    </div>
  );
}
