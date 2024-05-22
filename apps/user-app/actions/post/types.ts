import { PostType, LinkType,Comment } from "@prisma/client";



export interface getPost {
  id?:number;
  title: string;
  link: string;
  linkType: LinkType;
  description?: string | null;
  thumbnail?: string | null;
  hidden?: boolean;
  authorId?: string;
  type: PostType;
  upvotes: number;
  downvotes:number;
  comments:Comment[];
  
}

export interface createPost {
  id?:number;
  title: string;
  link: string;
  linkType: LinkType;
  description?: string | null;
  thumbnail?: string | null;
  hidden?: boolean;
  authorId?: string;
  type: PostType;
 
  
}


export { LinkType ,PostType };




