import React, { useState } from "react";
import {
  Grid,
  Button,
  TextField,
  useMediaQuery,
  CssBaseline,
  Fab,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import logo from "../assets/vidsplit-logo-dark-mode.png";
import GitHubIcon from "@mui/icons-material/GitHub";
import FavoriteIcon from "@mui/icons-material/Favorite";

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

const HomePage = () => {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [url, setUrl] = useState("");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const extractVideoID = (url) => {
    const extract_regex =
      "^.*(?:(?:youtu\\.be\\/|v\\/|vi\\/|u\\/\\w\\/|embed\\/|shorts\\/)|(?:(?:watch)?\\?v(?:i)?=|\\&v(?:i)?=))([^#\\&\\?]*).*";
    const match = url.match(extract_regex);
    return match && match[1].length === 11 ? match[1] : false;
  };

  const validateYoutubeURL = (url) => {
    const validate_regex = RegExp(
      "^.*(?:(?:youtu\\.be\\/|v\\/|vi\\/|u\\/\\w\\/|embed\\/|shorts\\/)|(?:(?:watch)?\\?v(?:i)?=|\\&v(?:i)?=))([^#\\&\\?]*).*"
    );
    return validate_regex.test(url);
  };

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Submitted");
    console.log(url);
    if (validateYoutubeURL(url)) {
      const videoID = extractVideoID(url);
      window.location.href = window.location.origin + "/watch?v=" + videoID;
    } else {
      setIsValidUrl(false);
      console.log("Invalid Youtube URL");
    }
  };

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
        alignItems="flex-start"
        spacing={2}
        marginTop={matches ? "20%" : "5%"}
        sx={{ padding: "0 10%" }}
      >
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <TextField
            label="Enter Youtube URL"
            variant="outlined"
            color="secondary"
            size="large"
            fullWidth
            error={!isValidUrl}
            helperText={isValidUrl ? " " : "Invalid Youtube URL"}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={4} sm={2} md={2} lg={1}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: "56px", width: matches ? "100%" : "auto" }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
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

export default HomePage;
