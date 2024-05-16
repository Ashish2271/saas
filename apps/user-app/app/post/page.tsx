import { createPostHandler, getPosts } from "../../actions/post";
import { Post } from "../../actions/post/types";
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
  let posts: { data: Post[] };

  // Check if response has a "data" property and assign it to "posts".
  if ("data" in response) {
    posts = response;
  } else {
    // Handle the error here or pass it up to the parent component.
    console.error("Error fetching posts:", response.error);
    return null;
  }

  return (
    <div>
      <h1>haha</h1>
      {posts.data.map((post: Post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </div>
  );
};

export default PostList;