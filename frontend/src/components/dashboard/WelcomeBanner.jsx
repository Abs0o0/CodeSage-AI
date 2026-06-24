import { Paper, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function WelcomeBanner() {
  const { user } = useAuth();

  return (
    <Paper sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h4" fontWeight={700}>
        Welcome back, {user?.username || "Developer"} 👋
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        This is the CodeSage Dashboard.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Future features:
        <br />
        • Code Review History
        <br />
        • AI Suggestions
        <br />
        • Documentation Generator
        <br />
        • Project Management
        <br />
        • Team Collaboration
      </Typography>
    </Paper>
  );
}