import { createPostHandler, getPosts } from "../../actions/post";
import { getPost } from "../../actions/post/types";
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
  
  let posts: getPost[] = []

  if ('data' in response) {
    const { data } = response;
    posts = data
    console.log(data);
  } else {
    const { error } = response;
    console.error(error);
  }

  return (
    <div className="px-72">
      <h1>haha</h1>

      {posts.length > 0 && (
        <li key={posts[0]?.id}>
          {posts[0]?.title}
       
          <VideoEmbed videoId={`${posts[0]?.link}`} />
          <Vote
            postId={posts[0]?.id}
            upVotes={posts[0]?.upvotes as any}
            downVotes={posts[0]?.downvotes as any}
            voteType={"UPVOTE"}
            // commentId= { undefined}
          />
        </li>
      )}
    </div>
  );
};

export default PostList;
