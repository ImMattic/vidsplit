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
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  renderHomePage() {
    return (
      <Grid container spacing={3} justify="center">
        <Grid item>
          <Typography variant="h4">Welcome to VidSplit!</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained">Submit</Button>
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
        </Routes>
      </Router>
    );
  }
}
