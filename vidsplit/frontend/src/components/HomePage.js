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
} from "@mui/material";
import logo from "../assets/vidsplit-logo.png";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  renderHomePage() {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <img src={logo} alt="Logo" className="logo" />
        </Grid>
        <Grid item>
          <TextField label="Enter Youtube URL" variant="outlined" />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
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
