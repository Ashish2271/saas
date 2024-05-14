// CreateCommentComponent.tsx
import React, { useState } from "react";
import { createCommentHandler } from "../../actions/comment/index";

const CreateCommentComponent: React.FC<{ postId: number }> = ({ postId }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {  ``
    e.preventDefault();

    // Call the server action to create the comment
    const result = await createCommentHandler({
      content,
      postId,
      parentId: undefined, // Assuming it's a top-level comment
    });

    if (result.error) {
      console.error("Failed to create comment:", result.error);
    } else {
      console.log("Comment created successfully:", result.data);
      // Optionally, you can perform additional actions after successful comment creation
    }

    // Reset the content input
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here..."
        required
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateCommentComponent;
