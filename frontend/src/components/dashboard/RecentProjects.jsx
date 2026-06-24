import { Paper, Typography } from "@mui/material";

export default function RecentProjects() {
  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" gutterBottom>
        Recent Projects
      </Typography>

      <ul>
        <li>CodeSage Frontend — Active</li>
        <li>Inventory System — Completed</li>
        <li>Hotel Booking UI — Under Review</li>
        <li>React Dashboard — Active</li>
      </ul>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        This section will later load projects from MongoDB.
      </Typography>
    </Paper>
  );
}