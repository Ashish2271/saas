'use client';
import { voteHandler } from '../actions/vote/index'; // Adjust the path if needed
import { VoteHandleType } from '../actions/vote/types';
import { VoteType } from "@prisma/client";
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

type VoteProps = {
  upVotes: number;
  downVotes: number;
  postId?: number;
  commentId?: number;
  voteType: VoteType | null;
};

const Vote = ({
  upVotes,
  downVotes,
  postId,
  commentId,
  voteType,
}: VoteProps) => {
  const currentPath = usePathname();

  const handleUpvote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postId !== undefined) {
      voteHandler({
        postId,
        voteType: VoteType.UPVOTE,
        currentPath,
      });
    } else if (commentId !== undefined) {
      voteHandler({
        commentId,
        voteType: VoteType.UPVOTE,
        currentPath,
      });
    }
  };

  const handleDownVote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postId !== undefined) {
      voteHandler({
        postId,
        voteType: VoteType.DOWNVOTE,
        currentPath,
      });
    } else if (commentId !== undefined) {
      voteHandler({
        commentId,
        voteType: VoteType.DOWNVOTE,
        currentPath,
      });
    }
  };

  return (
    <div className="flex gap-2">
      <form onSubmit={handleUpvote}>
        <button
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
          type="submit"
        >
          <ThumbsUpIcon
            className="w-4 h-4"
            type="submit"
            fill={voteType && voteType === VoteType.UPVOTE ? 'currentColor' : 'none'}
          />
          <span>{upVotes}</span>
        </button>
      </form>
      <form onSubmit={handleDownVote}>
        <button
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
          type="submit"
        >
          <ThumbsDownIcon
            className="w-4 h-4"
            fill={voteType && voteType === VoteType.DOWNVOTE ? 'currentColor' : 'none'}
          />
          <span>{downVotes}</span>
        </button>
      </form>
    </div>
  );
};

export default Vote;
