"use client";

import { Button } from "@workspace/ui/components/button";
import { Pause, Play } from "lucide-react";
import { useState } from "react";

type WatchStatusButtonProps = {
  watchId: string;
  status: string;
};

export function WatchStatusButton({ watchId, status }: WatchStatusButtonProps) {
  const [pending, setPending] = useState(false);
  const nextStatus = status === "active" ? "paused" : "active";

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch(`/api/sheetdue/watches/${watchId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        });
        window.location.reload();
      }}
    >
      {nextStatus === "active" ? (
        <Play aria-hidden className="size-3.5" />
      ) : (
        <Pause aria-hidden className="size-3.5" />
      )}
      {nextStatus === "active" ? "Activate" : "Pause"}
    </Button>
  );
}
