import { Paper, Typography } from "@mui/material";

export default function ActivityFeed() {
  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>

      <ul>
        <li>Mock Activity: User uploaded project.</li>
        <li>Mock Activity: AI review completed.</li>
        <li>Mock Activity: Documentation generated.</li>
        <li>Mock Activity: Settings updated.</li>
      </ul>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        This section will later display real user activity from the backend.
      </Typography>
    </Paper>
  );
}