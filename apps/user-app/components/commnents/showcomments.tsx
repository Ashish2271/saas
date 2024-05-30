'use client'
import  Vote  from "../Vote";
import React from "react";

// Define the type for the comment object
type Comment = {
  id: number;
  postId: number;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  commentType: string;
  isPinned: boolean;
  approved: boolean;
  parentId: number | null;
  repliesCount: number;
  upvotes: number;
  downvotes: number;
  user :  any;
};

// Define the props for the showComment component
type ShowCommentProps = {
  comments: Comment;
};

const ShowComment: React.FC<ShowCommentProps> = ({ comments }) => {
    console.log(comments)
  return (
    <div>
       
        <div key={comments?.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p><strong>Content:</strong> {comments?.content}</p>
          <p><strong>Created At:</strong> {new Date(comments?.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(comments?.updatedAt).toLocaleString()}</p>
          <p><strong>Comment Type:</strong> {comments?.commentType}</p>
          <p><strong>Approved:</strong> {comments?.approved ? "Yes" : "No"}</p>
          <p><strong>Pinned:</strong> {comments?.isPinned ? "Yes" : "No"}</p>
          <p><strong>Replies Count:</strong> {comments?.repliesCount}</p>
          <p><strong>Upvotes:</strong> {comments?.upvotes}</p>
          <p><strong>Downvotes:</strong> {comments?.downvotes}</p>
          <p><strong>User ID:</strong> {comments?.userId}</p>
          <p><strong>User ID:</strong> {comments?.user.name}</p>
           <Vote 
            //   postId={undefined}
              upVotes={comments?.upvotes}
              downVotes={comments?.downvotes}
              voteType={"UPVOTE"}
              commentId= { comments?.id}  />
          {/* <showUser user = {comments?.userId}> */}
          <p><strong>Post ID:</strong> {comments?.postId}</p>
        </div>
      
    </div>
  );
};

export default ShowComment;
