"use client"
// CreateCommentComponent.tsx
import React, { useState } from "react";
import { createCommentHandler } from "../../actions/comment/index";
import { TextField } from "@mui/material";


const CreateCommentComponent: React.FC<{ postId: number; fetchData: any }> = ({
  postId,
  fetchData,
}) => {
  console.log(postId);
  const [content, setContent] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
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
      fetchData()
      // Optionally, you can perform additional actions after successful comment creation
    }

    // Reset the content input
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here..."
        required
        className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      ></textarea> */}
      <TextField
        id="comment"
        label="comment"
        variant="outlined"
        onChange={(e) => setContent(e.target.value)}
        value={content}
        placeholder="Write your comment here..."
        required
        InputProps={{
          style: {
            color: "white", // Change this to your desired text color
          },
        }}
        className="h-32 p-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text"
      />
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateCommentComponent;
