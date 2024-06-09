// VoteComponent.tsx
import { usePathname } from "next/navigation";
import React, { useCallback } from "react";
import { voteHandler } from "../../actions/vote";
import { VoteType } from "@prisma/client";

type Props = {
  upVotes: number;
  downVotes: number;
  postId: number;
  score: number;
  onVote: (postId: number, voteType: VoteType) => void;
};

const currentPath = usePathname();
const VoteComponent: React.FC<Props> = ({
  postId,
  upVotes,
  downVotes,
  onVote,
}) => {
  const handleUpvote = useCallback(() => {
    voteHandler({
      postId,
      voteType: VoteType.UPVOTE,
      currentPath,
    });
  }, [voteHandler, postId]);

  const handleDownvote = useCallback(() => {
    voteHandler({
      postId,
      voteType: VoteType.DOWNVOTE,
      currentPath,
    });
  }, [voteHandler, postId]);

  return (
    <div className="flex">
      <button onClick={handleUpvote} className="mr-2">
        ▲ Upvote
      </button>
      <span>{upVotes}</span>
      <button onClick={handleDownvote} className="ml-2">
        ▼ Downvote
      </button>
      <span>{downVotes}</span>
    </div>
  );
};

export default VoteComponent;
