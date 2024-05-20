
import { createPostHandler, getPosts } from "../../actions/post";
// import { Post } from "../../actions/post/types";
import Vote from "../../components/Vote";
import { post } from "@prisma/client";
interface Props {}

const PostList: React.FC<Props> = async () => {
  // const post = {
  //   title: 'sdf',
  //   link: 'sdaf',
  //   linkType: 'YOUTUBE',
  //   description: "sdaf",
  //   type: 'SHORT'
  // }
  // const res = await createPostHandler({
  //   title: 'sdf',
  //   link: 'sdaf',
  //   linkType: 'YOUTUBE',
  //   description: "sdaf",
  //   type: 'SHORT'
    
  // })
  const posts= await getPosts();
  
  console.log(posts)
    
  return (
    <div>
      <h1>haha</h1>
    
      {//@ts-ignore
      posts.map((post:post) => (
        <li key={post.id}>{post.title}     
        <iframe
        width="560"
        height="315"
        src={post.link}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <Vote postId={post.id} upVotes={post.upvotes} downVotes={post.downvotes} voteType={"UPVOTE"}/></li>
      )
      )}
    </div>
  );
};

export default PostList;