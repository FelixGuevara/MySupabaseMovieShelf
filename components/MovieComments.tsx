"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMovieComment } from "@/app/contexts/MovieCommentProvider";
import { toast } from "sonner";
import { CommentItem } from "./CommentItem";

export function MovieComments() {
  const { moviecomments, loading, addComment, error } = useMovieComment();
  const [value, setValue] = useState("");

  if (loading) return <p>Loading comments…</p>;

  return (
    <section className="mt-8 space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>

      {moviecomments.length === 0 && (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}

      {moviecomments.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}

      <Textarea
        placeholder="Write a comment…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Button
        onClick={async () => {
          if (!value.trim()) {
            toast.error("Comment cannot be empty");
            return;
          }

          const ok = await addComment(value);
          if (ok) {
            setValue("");
            toast.success("Comment added");
          } else {
            toast.error("Failed to add comment");
          }
        }}
      >
        Add Comment
      </Button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  );
}