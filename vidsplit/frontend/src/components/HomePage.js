import React, { Component } from "react";
import DownloadPage from "./DownloadPage";
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
} from "@mui/material";
import {
  alpha,
  createTheme,
  styled,
  ThemeProvider,
} from "@mui/material/styles";
import logo from "../assets/vidsplit-logo-dark-mode.png";

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
  }

  renderHomePage() {
    return (
      <ThemeProvider theme={darkTheme}>
        <div className="toplogoBar">
          <a href="/">
            <img src={logo} alt="Vidsplit Logo" className="logo" />
          </a>
        </div>
        <div>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            className="homepageGrid"
          >
            <Grid item>
              <TextField
                label="Enter Youtube URL"
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ width: "500px" }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ height: "56px", marginLeft: "10px" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </div>
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
