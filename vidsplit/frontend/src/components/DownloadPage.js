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
  CircularProgress,
  Snackbar,
  Alert,
  Fab,
} from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { TimeField, LocalizationProvider } from "@mui/x-date-pickers";
import logo from "../assets/vidsplit-logo-dark-mode.png";
import Cookies from "js-cookie";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import GitHubIcon from "@mui/icons-material/GitHub";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
  const [timestamps, setTimestamps] = useState([{ start: null, end: null }]);
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("v");
  const [url] = useState(`youtube.com/watch?v=${videoId}`);
  const [videoData, setVideoData] = useState({});
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const csrftoken = Cookies.get("csrftoken");
  const [errorMessage, setErrorMessage] = useState(null);
  const [open, setOpen] = useState(false);

  // Timestamp handling functions
  const addTimestamp = () => {
    if (timestamps.length < 5) {
      setTimestamps([...timestamps, { start: null, end: null }]);
    }
  };

  const handleTimeChange = (index, type, time) => {
    const newTimestamps = [...timestamps];
    newTimestamps[index][type] = time;
    setTimestamps(newTimestamps);
  };

  const sendTimestamps = () => {
    const sessionID = Cookies.get("sessionID");
    setLoading(true);
    const timestampData = {
      session_id: sessionID,
      timestamps: timestamps,
    };
    fetch("api/generate", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(timestampData),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response status is not OK, reject the promise
          return response.json().then((error) => {
            throw new Error(error.error);
          });
        }
        return response.json();
      })
      .then((data) => {
        downloadVideo();
        console.log(data);
      })
      .then(() => {
        fetch(`/api/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({ session_id: sessionID }),
        });
      })
      .catch((error) => {
        // Handle the error here
        console.log("Caught");
        setErrorMessage(error.message);
        setOpen(true);
        setLoading(false);
      });
  };

  const downloadVideo = () => {
    const sessionID = Cookies.get("sessionID");
    const video_id = videoId;
    setLoading(false);
    fetch(`/api/download?session_id=${sessionID}&video_id=${video_id}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${video_id}_trimmed.mp4`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Helper function for converting seconds to HH:MM:SS format
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

  // Fetch video data when the page loads
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
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(videoData),
    })
      // Then fetches the session data
      .then(
        fetch(`/api/session?session_id=${sessionID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
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
            fullWidth
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
      {timestamps.map((timestamp, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1%",
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimeField
                label="Start Time"
                format="HH:mm:ss"
                value={timestamp.start}
                onChange={(time) => handleTimeChange(index, "start", time)}
                sx={{ marginRight: "2%" }}
              />
              <TimeField
                label="End Time"
                format="HH:mm:ss"
                value={timestamp.end}
                onChange={(time) => handleTimeChange(index, "end", time)}
              />
            </LocalizationProvider>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              marginTop: "1%",
            }}
          >
            {timestamps.length - 1 === index && timestamps.length < 5 && (
              <Button onClick={addTimestamp}>+ Add</Button>
            )}{" "}
          </Box>
        </Box>
      ))}
      <Box sx={{ m: 1, position: "relative" }}>
        <Button
          sx={{
            display: "block",
            margin: "0 auto",
            marginTop: "1%",
          }}
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={sendTimestamps}
        >
          Generate Video
        </Button>
        {loading && (
          <CircularProgress
            color="primary"
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "0px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={10000} // Hide after 10 seconds
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setOpen(false);
        }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <Fab
          color="primary"
          aria-label="Github"
          component="a"
          href="https://github.com/ImMattic/vidsplit/tree/main"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ marginRight: 1 }}
        >
          <GitHubIcon />
        </Fab>
        <Fab
          color="primary"
          aria-label="Donate"
          component="a"
          href="https://ko-fi.com/mattic"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FavoriteIcon />
        </Fab>
      </Box>
    </ThemeProvider>
  );
};

// Export the DownloadPage component
export default DownloadPage;
