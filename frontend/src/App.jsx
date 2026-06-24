import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthModal from "./components/auth/AuthModal";
import MuiThemeBridge from "./theme/MuiThemeBridge";
import Settings from "./Settings";
import { AuthLoadingScreen } from "./components/auth/UnauthenticatedGate";

function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();

  console.log({
    isLoading,
    isAuthenticated,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <Settings />;
}

export default function App() {
  return (
    <ThemeProvider>
      <MuiThemeBridge>
        <CssBaseline />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </MuiThemeBridge>
    </ThemeProvider>
  );
}
