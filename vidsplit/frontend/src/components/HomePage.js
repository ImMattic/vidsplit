import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Grid,
  Button,
  TextField,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import logo from "../assets/vidsplit-logo-dark-mode.png";
import DownloadPage from "./DownloadPage";
import LoginPage from "./LoginPage";

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

// Defines the HomePage class component
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidUrl: true,
      generating: false,
    };
  }

  // Parses the video ID from the URL
  extractVideoID = (url) => {
    const extract_regex =
      "^.*(?:(?:youtu\\.be\\/|v\\/|vi\\/|u\\/\\w\\/|embed\\/|shorts\\/)|(?:(?:watch)?\\?v(?:i)?=|\\&v(?:i)?=))([^#\\&\\?]*).*";
    const match = url.match(extract_regex);
    return match && match[1].length === 11 ? match[1] : false;
  };

  // Returns true or false if the URL is a valid Youtube URL
  validateYoutubeURL = (url) => {
    const validate_regex = RegExp(
      "^(http(s)?:\\/\\/)?((w){3}.)?youtu(be|.be)?(\\.com)?\\/(watch\\?v=|shorts\\/|playlist\\?list=)?([a-zA-Z0-9_-]{11})?$"
    );
    return validate_regex.test(url);
  };

  // Passes the TextField URL input to the state
  handleInputChange = (event) => {
    this.setState({ url: event.target.value });
  };

  // Handles the submit button interaction
  handleSubmit = () => {
    console.log("Submitted");
    console.log(this.state.url);
    // Checks if the URL is a valid Youtube URL
    if (this.validateYoutubeURL(this.state.url)) {
      const videoID = this.extractVideoID(this.state.url);
      // Redirects to the download page
      window.location.href = window.location.origin + "/watch?v=" + videoID;
    } else {
      // If the URL is invalid, sets the state to false
      this.setState({ isValidUrl: false });
      console.log("Invalid Youtube URL");
    }
  };

  // Renders the home page to the user
  renderHomePage() {
    // Uses MUI theme to style the page
    const theme = useTheme();
    // Checks if the screen size is less than 600px (sm breakpoint)
    const matches = useMediaQuery(theme.breakpoints.down("sm"));
    return (
      // Uses the dark theme
      <ThemeProvider theme={darkTheme}>
        {/* Uses styles from the theme for CSS */}
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
              error={!this.state.isValidUrl}
              helperText={this.state.isValidUrl ? " " : "Invalid Youtube URL"}
              onChange={this.handleInputChange}
            />
          </Grid>
          <Grid item xs={4} sm={2} md={2} lg={1}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: "56px", width: matches ? "100%" : "auto" }}
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }

  // Sets the HomePageComponent to the renderHomePage function
  HomePageComponent = () => this.renderHomePage();

  // Routes the user to various pages based on the URL
  render() {
    return (
      <Router>
        <Routes>
          <Route path="" element={<this.HomePageComponent />} />
          <Route path="/:videoID" element={<DownloadPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  }
}
