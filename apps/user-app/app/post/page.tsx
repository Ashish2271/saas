import { createPostHandler, getPosts } from "../../actions/post";
import { Post } from "../../actions/post/types";
import VideoEmbed from "../../components/VideoEmbed";
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
  const response = await getPosts();
  let posts: Post[] = []

  if ('data' in response) {
    const { data } = response;
    posts = data
    console.log(data);
  } else {
    const { error } = response;
    console.error(error);
  }

  return (
    <div>
      <h1>haha</h1>

      {posts.length > 0 && posts.map((post) => (
        <li key={post.id}>
          {post.title}
          <VideoEmbed videoId={`${post.link}`} />
          <Vote
            postId={post.id}
            upVotes={post.upvotes}
            downVotes={post.downvotes}
            voteType={"UPVOTE"}
          />
        </li>
      ))}
    </div>
  );
};

export default PostList;
