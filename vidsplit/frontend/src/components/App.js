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
import ProtectedRoutes from "../utils/ProtectedRoutes";
import HomePage from "./HomePage";
import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import NotAuthorized from "./NotAuthorized";

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return <HomePage />;
//   }
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<ProtectedRoutes />}>
          <Route path="" element={<HomePage />} />
          <Route path="/:videoID" element={<DownloadPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notauthorized" element={<NotAuthorized />} />
      </Routes>
    </Router>
  );
}

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
