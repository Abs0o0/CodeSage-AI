import { useState } from "react";
import UnauthenticatedGate from "../components/auth/UnauthenticatedGate";
import AuthModal from "../components/auth/AuthModal";

const Login = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-2xl px-6">
        <UnauthenticatedGate
          onSignIn={() => setAuthModalOpen(true)}
        />

        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Login;