import { Button, Paper, Typography } from "@mui/material";

export default function QuickActions() {
  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>

      <div className="flex flex-wrap gap-3">
        <Button variant="contained">
          Upload Code
        </Button>

        <Button variant="outlined">
          Start AI Review
        </Button>

        <Button variant="outlined">
          Generate Docs
        </Button>

        <Button variant="outlined">
          View Reports
        </Button>
      </div>
    </Paper>
  );
}