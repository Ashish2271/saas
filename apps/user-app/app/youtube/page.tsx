import { createYoutubePost, getYtVideos } from "../../actions/youtube";
import VideoEmbed from "../../components/VideoEmbed";
import Vote from "../../components/Vote";
import { post } from "@prisma/client";
interface Props {}

// async function fetchYoutubeData() {
//   try {
//     const response = await createYoutubePost();
//     return response
//   } catch (error) {
//     console.error(`Failed to create Youtube post: ${error}`);
//   }
// }

const PostList: React.FC<Props> = async () => {
  // const fetch = await createYoutubePost();
  // cron.schedule("0 0 * * *", () => {
  //   fetchYoutubeData();
  // });

  // const response = await createYoutubePost();
  // //   console.log(response);
  // let posts: post[] = [];

  // if ("data" in response) {
  //   const { data } = response;
  //   posts = data;
  //   // console.log(data);
  // } else {
  //   const { error } = response;
  //   console.error(error);
  // }

  return (
    <div className="px-72 text-white">
      {/* {response && (
        <ul>
          {posts.map((post) => {
            return (
              <div>
                <li key={post.id}>{JSON.stringify(post.id)}</li>
                <li key={post.id}>{JSON.stringify(post.title)}</li>
              </div>   
            );
          })}
        </ul>
      )} */}
    </div>
  );
};

export default PostList;
