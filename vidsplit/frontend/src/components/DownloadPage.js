import React, { Component } from "react";
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

export default class DownloadPage extends Component {}
