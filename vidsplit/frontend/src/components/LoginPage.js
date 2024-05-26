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
} from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { TimeField, LocalizationProvider } from "@mui/x-date-pickers";
import logo from "../assets/vidsplit-logo-dark-mode.png";
import discord_signin from "../assets/Discord_Signin.png";
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

// Define the Login functional component
const LoginPage = (props) => {
  const [timestamps, setTimestamps] = useState([{ start: null, end: null }]);
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("v");
  const [url] = useState(`youtube.com/watch?v=${videoId}`);
  const [videoData, setVideoData] = useState({});
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);

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
        spacing={2}
        style={{ height: "10vh", width: "100%", margin: 0, marginTop: "10%" }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            Woah there pardner! ✋🤠
          </Typography>
          <Typography variant="h5" align="center" marginTop="0.5%">
            VidSplit is currently in a closed beta. Please sign in below and
            we'll see if you're on the list.
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center", marginTop: "1%" }}>
          <a href="/oauth2/discord/login">
            <img
              src={discord_signin}
              alt="Discord Sign In"
              style={{ width: matches ? "70%" : "300px", height: "auto" }}
            />
          </a>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

// Export the DownloadPage component
export default LoginPage;
