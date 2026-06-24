import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard({ title, value, description }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}