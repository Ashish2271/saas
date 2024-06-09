import { Container } from "@mui/material";
import VideoEmbed from "../../components/VideoEmbed";
import { getPosts } from "../../actions/post";

const Example = async () => {
  const fetchData = async () => {
    const response = await getPosts();

    if ("data" in response) {
      const { data } = response;
      return data;
    } else {
      const { error } = response;
      console.error(error);
    }
  };

  const data = await fetchData();

  // Render VideoList component
  return (
    <div className="flex justify-end ml-80 mt-10">
      <Container
        maxWidth="2xl"
        sx={{ pt: 1.5, "&": { px: { xs: 1.5, sm: 3 } } }}
      >
        {data ? <VideoEmbed data={data} /> : null}
      </Container>
    </div>
  );
};

export default Example;
