import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  Routes,
} from "react-router-dom";
import {
  Grid,
  Button,
  ButtonGroup,
  Typography,
  TextField,
  GlobalStyles,
  useMediaQuery,
  Box,
} from "@mui/material";
import {
  alpha,
  createTheme,
  styled,
  ThemeProvider,
} from "@mui/material/styles";
import logo from "../assets/vidsplit-logo-dark-mode.png";
import { useTheme } from "@mui/material/styles";
import DownloadPage from "./DownloadPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#724edc",
    },
    secondary: {
      main: "#77c3dc",
    },
  },
});

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      date: null,
    };
  }

  // Passes the TextField URL input to the state
  handleInputChange = (event) => {
    this.setState({ url: event.target.value });
  };

  // Handles the submit button interaction
  handleSubmit = () => {
    console.log("Submitted");
    console.log(this.state.url);
    const sessionID = uuidv4(); // Generates a new session
    const videoData = {
      session_id: sessionID,
      video_url: this.state.url,
    };
    fetch("api/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        this.setState({ date: data.date });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  renderHomePage() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("sm"));
    return (
      <ThemeProvider theme={darkTheme}>
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

  HomePageComponent = () => this.renderHomePage();

  render() {
    return (
      <Router>
        <Routes>
          <Route path="" element={<this.HomePageComponent />} />
          <Route path="/:videoID" element={<DownloadPage />} />
        </Routes>
      </Router>
    );
  }
}
