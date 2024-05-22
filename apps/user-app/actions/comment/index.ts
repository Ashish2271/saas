"use server";
import { getServerSession } from "next-auth";
import { CreateComment } from "./types";
import { authOptions } from "../../lib/auth";
// import { rateLimit } from "@/lib/utils";
import prisma from "@repo/db/client";
// import {
//   CommentApproveIntroSchema,
//   CommentDeleteSchema,
//   CommentInsertSchema,
//   CommentPinSchema,
//   CommentUpdateSchema,
// } from "./schema";
// import { createSafeAction } from "@/lib/create-safe-action";
import { CommentType, Prisma } from "@prisma/client";
// import { revalidatePath } from "next/cache";
// import { ROLES } from "../types";

export const getComments = async (
  q: Prisma.CommentFindManyArgs,
  parentId: number | null | undefined,
) => {
  let parentComment = null;
  if (parentId) {
    parentComment = await prisma.comment.findUnique({
      where: { id: parseInt(parentId.toString(), 10) },
      include: {
        user: true,
      },
    });
  }
  if (!parentComment) {
    delete q.where?.parentId;
  }
  const pinnedComment = await prisma.comment.findFirst({
    where: {
      postId: q.where?.postId,
      isPinned: true,
      ...(parentId ? { parentId: parseInt(parentId.toString(), 10) } : {}),
    },
    include: q.include,
  });
  if (pinnedComment) {
    q.where = {
      ...q.where,
      NOT: {
        id: pinnedComment.id,
      },
    };
  }

  const comments = await prisma.comment.findMany(q);
  const combinedComments = pinnedComment
    ? [pinnedComment, ...comments]
    : comments;

  return {
    comments: combinedComments,
    parentComment,
  };
};

export const createCommentHandler = async (
  data: CreateComment
): Promise<any> => {
  const session = await getServerSession(authOptions); //get session

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const { content, postId, parentId } = data;

  const userId = session.user.id;
  console.log("UserId:", userId);
console.log("PostId:", postId);
console.log("ParentId:", parentId);


  //   #rate limiting
  //   if (!rateLimit(userId)) {
  //     return { error: "Rate limit exceeded. Please try again later." };
  //   }

  try {
    // Check if the parent comment exists and is a top-level comment
    // Only top-level comments can have replies like youtube comments otherwise it would be a thread
    let parentComment;
    if (parentId) {
      parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return { error: "Parent comment not found." };
      }

      if (parentComment.parentId) {
        return { error: "Cannot reply to a nested comment." };
      }
    }

    let comment;
    if (parentComment) {
      await prisma.$transaction(async (prisma) => {
        comment = await prisma.comment.create({
          data: {
            content,
            postId,
            parentId, // undefined if its a comment without parent (top level)
            userId,
          },
        });
        await prisma.comment.update({
          where: { id: parentId },
          data: {
            repliesCount: { increment: 1 },
          },
        });
      });
    } else {
      await prisma.$transaction(async (prisma) => {
        comment = await prisma.comment.create({
          data: {
            content,
            postId,
            parentId, // undefined if its a comment without parent (top level)
            userId
            // commentType:
            //   introData && introData.length > 0
            //     ? CommentType.INTRO
            //     : CommentType.DEFAULT,
          },
        });

        await prisma.post.update({
          where: { id: postId },
          data: {
            commentsCount: { increment: 1 },
          },
        });
      });
    }
    // if (data.currentPath) {
    //   revalidatePath(data.currentPath);
    // }
    return { data: comment };
  } catch (error: any) {
    return { error: error.message || "Failed to create comment." };
  }
};