'use server'

import { getServerSession } from "next-auth";
import { Post } from "./types";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";


export const createPostHandler = async (
  data: Post
): Promise<any> => {
  const session = await getServerSession(authOptions); // Get session

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  const { title, link,linkType,  description, thumbnail, hidden,type } = data;
  const authorId = session.user.id;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        link,
        linkType,
        description,
        thumbnail,
        hidden: hidden ?? false,
        authorId,
        type,
      },
    });
   console.log('asdfasdf')
    return { data: post };

  } catch (error: any) {
    return { error: error.message || "Failed to create post." };
  }
};





export const getPosts = async (): Promise<{ data: Post[] } | { error: any }> => {
  const session = await getServerSession(authOptions); // Get session

  if (!session || !session.user) {
    return { error: "Unauthorized or insufficient permissions" };
  }

  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: true, // Include comments if needed
        // Any other related models you want to include
      },
    });

    return { data: posts };
  } catch (error: any) {
    return { error: error.message || "Failed to retrieve posts." };
  }
};