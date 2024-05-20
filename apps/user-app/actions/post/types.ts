import { PostType, LinkType } from "@prisma/client";


export interface Post {
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
  
}

export { LinkType ,PostType };




