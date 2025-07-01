
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
      .select("*, profiles(username, avatar_url)")
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
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Comentários</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-3 p-2 border rounded">
          <p className="text-sm">{comment.content}</p>
          <div className="text-xs text-gray-500 mt-1">
            {comment.profiles?.username || "Usuário"} •{" "}
            {new Date(comment.created_at).toLocaleString()}
          </div>
        </div>
      ))}

      {session ? (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva um comentário..."
          />
          <Button type="submit">Comentar</Button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">Faça login para comentar.</p>
      )}
    </div>
  );
}
