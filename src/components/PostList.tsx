
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
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-700 mt-2">{post.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            Publicado em {new Date(post.created_at).toLocaleString()}
          </p>
          <CommentSection postId={post.id} />
        </div>
      ))}
    </div>
  );
}
