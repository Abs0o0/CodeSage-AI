import { Paper, Typography } from "@mui/material";

export default function SystemStatus() {
  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" gutterBottom>
        System Status
      </Typography>

      <Typography>✅ Backend API Connected</Typography>
      <Typography>✅ Authentication Active</Typography>
      <Typography>✅ MongoDB Connected</Typography>
      <Typography>⚠ AI Service (Mock Mode)</Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Real system health metrics will be implemented later.
      </Typography>
    </Paper>
  );
}