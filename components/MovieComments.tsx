"use client";

import { useState } from "react";
import { useMovieComment } from "@/app/contexts/MovieCommentProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function MovieComments() {
const { moviecomments, loading, addComment, error } = useMovieComment();
const [value, setValue] = useState("");

    if (loading) return <p>Loading Comments...</p>;
    console.log(moviecomments);

    return (
        <section>
            <h3>Comments</h3>

            { moviecomments.length === 0 && (
                <p> No Comments yet.</p> 
            )}

            <Textarea placeholder = "Write a Comment" value = {value} 
                onChange={(e) => setValue(e.target.value)}
            />

            <Button
                onClick={ async()=>{
                    if(!value.trim()){
                        toast.error("Comment cannot be empty")
                        return;
                    }

                    const ok = await addComment(value)
                    if(ok){
                        setValue("");
                        toast.success("Comment added...")
                    } else{
                        toast.error("Fail to add comment.")
                    }

                }}
            >Add Comment</Button>
        </section>
    );

}