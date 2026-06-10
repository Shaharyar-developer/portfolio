"use client";

import { authClient } from "@/lib/auth/client";
import { Button } from "@workspace/ui/components/button";
import { LogIn } from "lucide-react";
import { useState } from "react";

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);

  return (
    <Button
      onClick={async () => {
        setPending(true);
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/sheetdue/dashboard",
        });
      }}
      disabled={pending}
    >
      <LogIn aria-hidden className="size-4" />
      {pending ? "Opening Google" : "Sign in with Google"}
    </Button>
  );
}
