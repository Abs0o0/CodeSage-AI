import { Paper, Typography, Box } from "@mui/material";

const SectionPanel = ({ title, description, children }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      <Box mb={4}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        )}
      </Box>

      {children}
    </Paper>
  );
};

export default SectionPanel;