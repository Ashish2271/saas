import { PostType, LinkType } from "@prisma/client";


export interface Post {
  id?:any;
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




