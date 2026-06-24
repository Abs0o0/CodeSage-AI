import { Button, CircularProgress, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ACCENT } from "../settings/constants";

export default function UnauthenticatedGate({ onSignIn }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-950/50">
          <LockOutlinedIcon sx={{ color: ACCENT, fontSize: 28 }} />
        </div>
        <Typography variant="h5" className="font-bold text-gray-900 dark:text-gray-100">
          Settings require authentication
        </Typography>
        <Typography variant="body2" className="mt-2 text-gray-500 dark:text-gray-400">
          Sign in to manage your CodeSage profile, AI preferences, theme, and
          security settings.
        </Typography>
        <Button
          variant="contained"
          onClick={onSignIn}
          className="mt-6"
          sx={{
            bgcolor: ACCENT,
            textTransform: "none",
            px: 4,
            py: 1.2,
            "&:hover": { bgcolor: "#9333ea" },
          }}
        >
          Sign In to Continue
        </Button>
      </div>
    </div>
  );
}

export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <CircularProgress sx={{ color: ACCENT }} />
    </div>
  );
}
