import { Paper, Typography } from "@mui/material";

export default function SectionPanel({ title, description, children }) {
  return (
    <Paper
      elevation={0}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 md:p-8"
    >
      <div className="mb-8">
        <Typography
          variant="h5"
          className="font-semibold text-gray-900 dark:text-gray-100"
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            className="mt-1 text-gray-500 dark:text-gray-400"
          >
            {description}
          </Typography>
        )}
      </div>
      {children}
    </Paper>
  );
}
