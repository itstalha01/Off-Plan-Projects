"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/inventory/auth", { method: "DELETE" });
    // Wipe the cached units/shares so the next login (possibly a different
    // user, same browser tab) can't briefly render this session's data.
    queryClient.clear();
    router.replace("/inventory/login");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? "Logging out…" : "Log out"}
    </Button>
  );
}
