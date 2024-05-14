export interface CreateComment {
  content: string
  postId: number
  parentId: number | undefined
}