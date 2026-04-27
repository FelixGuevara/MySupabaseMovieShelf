"use client";

import { useState } from "react";
import { useMovieComment } from "@/app/contexts/MovieCommentProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Pencil } from "lucide-react";

export function CommentItem() {
  const supabase = createClient();
  const { editComment } = useMovieComment();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(""/*comment.content*/);
  const [saving, setSaving] = useState(false);

  const { data: { user }, } = useState(() => ({ data: { user: null as any } }))[0];
  const isOwner = true;//comment.userid === user?.id;

    return (
    <div className="rounded-md border p-3">
      <p className="text-sm text-gray-900">{""/*comment.content*/}</p>

      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
        {1/*comment.added_at*/ && <span>(edited)</span>}

        {isOwner && (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}