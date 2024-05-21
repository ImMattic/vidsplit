import React, { Component, useState, useEffect } from "react";
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

const DownloadPage = (props) => {
  const videoId = window.location.pathname.substring(1);
  const [url, setUrl] = useState(`youtube.com/watch?v=${videoId}`);
  const [date, setDate] = useState(null);
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
    </ThemeProvider>
  );
};

export default DownloadPage;
// export default class DownloadPage extends Component {
//   constructor(props) {
//     super(props);
//     const videoId = window.location.pathname.substring(1);
//     this.state = {
//       url: "",
//       yt_url: "youtube.com/watch?v=${videoId}",
//       date: null,
//     };
//   }

//   render() {
//     return (
//       <ThemeProvider theme={darkTheme}>
//         <div>
//           <a href="/" className="toplogoBar">
//             <img
//               src={logo}
//               alt="Vidsplit Logo"
//               className="logo"
//               style={{ width: matches ? "70%" : "400px", height: "auto" }}
//             />
//           </a>
//         </div>
//         <Grid
//           container
//           direction="row"
//           justifyContent="center"
//           alignItems="center"
//           spacing={2}
//           marginTop={matches ? "10%" : "2%"}
//           sx={{ padding: "0 10%" }}
//         >
//           <Grid item xs={12} sm={12} md={6} lg={3}>
//             <TextField
//               label="Enter Youtube URL"
//               variant="outlined"
//               color="secondary"
//               size="large"
//               fullWidth
//               value={this.state.url}
//               disabled
//             />
//           </Grid>
//           <Grid item xs={4} sm={2} md={2} lg={1}>
//             <Button
//               variant="contained"
//               color="primary"
//               fullWidthf
//               sx={{ height: "56px", width: matches ? "100%" : "auto" }}
//               disabled
//             >
//               Submit
//             </Button>
//           </Grid>
//         </Grid>
//       </ThemeProvider>
//     );
//   }
// }
