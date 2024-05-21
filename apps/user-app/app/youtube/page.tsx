import { createYoutubePost } from "../../actions/youtube";
import VideoEmbed from "../../components/VideoEmbed";
import Vote from "../../components/Vote";
import { post } from "@prisma/client";
interface Props {}

const PostList: React.FC<Props> = async () => {
  const response = await createYoutubePost();
//   console.log(response);
  let posts: post[] = [];

  if ("data" in response) {
    const { data } = response;
    posts = data;
    // console.log(data);
  } else {
    const { error } = response;
    console.error(error);
  }

  return (
    <div className="px-72">
      <h1>haha</h1>

      {posts.length > 0 &&
        posts.map((post) => (
          <li key={post.id}>
            {post.title}
            {post.id == 107? <VideoEmbed videoId={`${post.link}`} /> : <div></div>}
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
