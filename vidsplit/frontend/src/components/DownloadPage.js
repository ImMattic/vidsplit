import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Grid,
  Button,
  Typography,
  TextField,
  useMediaQuery,
  Box,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import logo from "../assets/vidsplit-logo-dark-mode.png";
import Cookies from "js-cookie";

// Defines the dark theme for the page
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#724edc",
    },
    secondary: {
      main: "#77c3dc",
    },
    background: {
      default: "#141f2b",
      paper: "#1d2d3e",
    },
  },
});

// Define the DownloadPage functional component
const DownloadPage = (props) => {
  const videoId = window.location.pathname.substring(1);
  const [url] = useState(`youtube.com/watch?v=${videoId}`);
  const [videoData, setVideoData] = useState({});
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  // Helper function for convering seconds to HH:MM:SS format
  function formatDuration(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration - hours * 3600 - minutes * 60;

    let result = "";
    if (hours > 0) {
      result += hours + "h ";
    }
    if (minutes > 0) {
      result += minutes + "m ";
    }
    result += seconds + "s";
    return result;
  }

  // Fetch video data when the component mounts
  useEffect(() => {
    const sessionID = uuidv4(); // Generates a new session
    const videoData = {
      session_id: sessionID,
      video_id: videoId,
    };
    // Initalizes the session
    fetch("api/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoData),
    })
      // Then fetches the session data
      .then(
        fetch(`/api/session?session_id=${sessionID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      )
      // Then assigns the session data to videoData
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setVideoData(data);
      })
      .then(() => {
        // Save session ID as a cookie
        Cookies.set("sessionID", sessionID);
      });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div>
        <a href="/" className="toplogoBar">
          <img
            src={logo}
            alt="Vidsplit Logo"
            className="logo"
            style={{ width: matches ? "70%" : "400px", height: "auto" }}
          />
        </a>
      </div>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        marginTop={matches ? "10%" : "2%"}
        sx={{ padding: "0 10%" }}
      >
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <TextField
            label="Enter Youtube URL"
            variant="outlined"
            color="secondary"
            size="large"
            fullWidth
            value={url}
            disabled
          />
        </Grid>
        <Grid item xs={4} sm={2} md={2} lg={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidthf
            sx={{ height: "56px", width: matches ? "100%" : "auto" }}
            disabled
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "2%",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            m: 2,
            p: 2,
            borderRadius: 2,
            maxWidth: "50%",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <img
                src={videoData.video_thumbnail}
                alt="Video Thumbnail"
                style={{ width: "100%", height: "auto", borderRadius: "15px" }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h4" color="textPrimary">
                {videoData.video_title}
              </Typography>
              <Typography variant="subtitle1" color="textPrimary">
                Duration: {formatDuration(videoData.video_length)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

// Export the DownloadPage component
export default DownloadPage;
