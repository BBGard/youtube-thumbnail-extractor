/**
 * @description Simple Web app to extract a thumbnail image from a given youtube video url
 */
import { useState } from 'react'
import './App.css'
import { Box, Typography, Button, Skeleton, ButtonGroup, OutlinedInput, Card, CardActions, CardContent, CardMedia, } from "@mui/material";

function App() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const videoId = getVideoId(videoUrl);
      const thumbnailUrl = await getThumbnailUrl(videoId);
      setThumbnailUrl(thumbnailUrl);
    } catch (error) {
      setError((error as Error).message);
    }
    setLoading(false);
  };

  // Extract the video id from the url
  const getVideoId = (url: string) => {
    const videoId = url.split("v=")[1];
    if (!videoId) {
      throw new Error("Invalid Youtube URL");
    }
    return videoId;
  }

  // Get the thumbnail url from the video id
  const getThumbnailUrl = async (videoId: string) => {
    const response = await fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`);
    const data = await response.json();
    return data.thumbnail_url;
  }




  // Main App
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100svh",
        maxHeight: "fit-content",
        padding: "0 1rem",
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ marginTop: "10%" }}>
        Youtube Thumbnail Extractor
      </Typography>
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          margin: "1rem auto",
          height: "fit-content",
        }}
      >
        <CardContent
          sx={{
            textAlign: "center",
            marginBottom: "1rem",
            padding: "1rem",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            This app extracts the thumbnail image from a given youtube video
            url.
            <br />
            <br />
          </Typography>
          <Typography variant="body1" fontSize={"1.1rem"}>
            Simply copy the url of the youtube video and paste it in the input
            box below.
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          marginBottom: "1rem",
          height: "fit-content",
        }}
      >
        {thumbnailUrl && !loading && (
          // Only render the image if the thumbnailUrl is not empty

          <CardMedia component="img" width="300" image={thumbnailUrl} />
        )}

        {loading && (
          // Show skeleton if the image is loading
          <Skeleton
            variant="rectangular"
            width={500}
            height={300}
            animation="wave"
          />
        )}

        {thumbnailUrl && (
          <CardActions>
            <Button
              fullWidth
              disabled={!thumbnailUrl}
              variant="contained"
              href={thumbnailUrl}
              target="_blank"
              download
            >
              Download
            </Button>
          </CardActions>
        )}

        <form onSubmit={handleSubmit}>
          <CardActions>
            <OutlinedInput
              fullWidth
              placeholder="Enter youtube video url"
              inputProps={{ "aria-label": "Youtube Link" }}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setError("");
              }}
              value={videoUrl}
            />
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
            >
              <Button
                fullWidth
                type="submit"
                disabled={!videoUrl}
                color="success"
              >
                Extract
              </Button>
              <Button
                onClick={() => {
                  setVideoUrl("");
                  setThumbnailUrl("");
                  setError("");
                }}
                color="error"
              >
                Clear
              </Button>
            </ButtonGroup>
          </CardActions>
        </form>
        <Typography variant="h4" component="h4" gutterBottom>
          {error}
        </Typography>
      </Card>
    </Box>
  );
}

export default App
