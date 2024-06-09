"use server";

import { getServerSession } from "next-auth";
import { VoteHandleType } from "./types";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { VoteType } from "@prisma/client";
import { revalidatePath } from "next/cache";
// import { createSafeAction } from "@/lib/create-safe-action";
import { VoteHandleSchema } from "./schema";

export const voteHandler = async (data: VoteHandleType): Promise<any> => {
  const session = await getServerSession(authOptions);
  let targetType: "post" | "comment" | null = null;
  let targetId: number | undefined = undefined;

  if (!session || !session.user.id) {
    return { error: "Unauthorized" };
  }
console.log("hahaha")
  const parse = VoteHandleSchema.safeParse(data);

  if (!parse.success) {
    console.log(parse.error);
    return { message: "Failed to create " };
  }

  const { postId, commentId, voteType, currentPath } = data;

  if (!postId && !commentId) {
    //or
    return { error: "No valid target specified." };
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!userExists) {
      return { error: "User not found." };
    }

    await prisma.$transaction(async (prisma) => {
      if (commentId) {
        targetType = "comment";
        targetId = commentId;
      } else {
        targetType = "post";
        targetId = postId;
      }
      const existingVote = await prisma.vote.findFirst({
        where: {
          userId: session.user.id,
          ...(commentId ? { commentId } : {}),
          ...(postId ? { postId } : {}),
        },
      });

      if (existingVote) {
        if (existingVote.voteType === voteType) {
          await prisma.vote.delete({
            where: { id: existingVote.id },
          });
          const q = {
            where: { id: targetId },
            data: {
              [voteType === VoteType.UPVOTE ? "upvotes" : "downvotes"]: {
                decrement: 1,
              },
            },
          };
          if (targetType === "comment") {
            await prisma.comment.update(q);
          } else if (targetType === "post") {
            await prisma.post.update(q);
            await prisma.post.update({
              where: { id: targetId },
              data: {
                ratings: { decrement: 1 },
              },
            });
          }
        } else {
          await prisma.vote.update({
            where: { id: existingVote.id },
            data: { voteType },
          });

          const incrementField =
            voteType === VoteType.UPVOTE ? "upvotes" : "downvotes";
          const decrementField =
            voteType === VoteType.UPVOTE ? "downvotes" : "upvotes";

          const q = {
            where: { id: targetId },
            data: {
              [incrementField]: { increment: 1 },
              [decrementField]: { decrement: 1 },
            },
          };
          if (targetType === "comment") {
            await prisma.comment.update(q);
          } else if (targetType === "post") {
            await prisma.post.update(q);
            if (voteType === VoteType.UPVOTE) {
              await prisma.post.update({
                where: { id: targetId },
                data: {
                  ratings: { increment: 2 }, // Increment ratings by 1 for an upvote
                },
              });
            } else {
              await prisma.post.update({
                where: { id: targetId },
                data: {
                  ratings: { decrement: 2 }, // Decrement ratings by 1 for a downvote or other vote type
                },
              });
            }
          }
        }
      } else {
        await prisma.vote.create({
          data: {
            voteType,
            userId: session.user.id,
            ...(commentId ? { commentId } : {}),
            ...(postId ? { postId } : {}),
          },
        });
        const q = {
          where: { id: targetId },
          data: {
            [voteType === VoteType.UPVOTE ? "upvotes" : "downvotes"]: {
              increment: 1,
            },
          },
        };
        if (targetType === "comment") {
          await prisma.comment.update(q);
        } else {
          await prisma.post.update(q);
          
          if (voteType === VoteType.UPVOTE) {
            await prisma.post.update({
              where: { id: targetId },
              data: {
                ratings: { increment: 1 }, // Increment ratings by 1 for an upvote
              },
            });
          } else {
            await prisma.post.update({
              where: { id: targetId },
              data: {
                ratings: { decrement: 1 }, // Decrement ratings by 1 for a downvote or other vote type
              },
            });
          }
        }
      }
    });
    const q = {
      where: { id: targetId! },
    };
    let updatedEntity;
    if (targetType === "comment") {
      updatedEntity = await prisma.comment.findUnique(q);
    } else {
      updatedEntity = await prisma.post.findUnique(q);
    }

    if (currentPath) {
      revalidatePath("/valorant");
    }

    return { data: updatedEntity };
  } catch (error) {
    console.error(error);
    return { error: "Failed to process the vote." };
  }
};

// export const voteHandlerAction = createSafeAction(
//   VoteHandleSchema,
//   voteHandler
// );
