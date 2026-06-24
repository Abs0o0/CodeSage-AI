import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

import MuiThemeBridge from "./theme/MuiThemeBridge";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <MuiThemeBridge>
        <CssBaseline />

        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </MuiThemeBridge>
    </ThemeProvider>
  );
}