"use client";

import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { MovieComment } from "@/app/types/movieComment";
import { useMovieComments } from "@/app/contexts/MovieCommentProvider";
import { createClient } from "@/lib/supabase/client";

export function CommentItem({ comment }: { comment: MovieComment }) {
  const supabase = createClient();
  const { editComment } = useMovieComments();

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const {
    data: { user },
  } = useState(() => ({ data: { user: null as any } }))[0];

  const isOwner = comment.userid === user?.id;

  const onSave = async () => {
    if (!value.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSaving(true);
    const ok = await editComment(comment.id, value);

    if (ok) {
      toast.success("Comment updated");
      setIsEditing(false);
    } else {
      toast.error("Failed to update comment");
    }

    setSaving(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-md border p-3 space-y-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={onSave} disabled={saving}>
            <Check className="mr-1 h-4 w-4" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setValue(comment.content);
              setIsEditing(false);
            }}
            disabled={saving}
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border p-3">
      <p className="text-sm text-gray-900">{comment.content}</p>

      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
        {comment.added_at && <span>(edited)</span>}

        {isOwner && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}