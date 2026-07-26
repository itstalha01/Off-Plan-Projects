"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRevokeShare, useShares } from "../api/use-shares";

export function ManageSharesDialog() {
  const [open, setOpen] = useState(false);
  const { data: shares, isLoading } = useShares();
  const revokeShare = useRevokeShare();

  async function handleCopy(token: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/inventory/share/${token}`);
    toast.success("Link copied");
  }

  async function handleRevoke(token: string) {
    if (!confirm("Revoke this link? It will stop working immediately.")) return;
    try {
      await revokeShare.mutateAsync(token);
      toast.success("Link revoked");
    } catch {
      toast.error("Couldn't revoke the link. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        <Link2 className="size-3.5" /> Shares
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Shares you&apos;ve sent</DialogTitle>
        </DialogHeader>

        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {!isLoading && (!shares || shares.length === 0) && (
          <p className="text-sm text-muted-foreground">
            No share links yet — select units in the grid to create one.
          </p>
        )}

        {shares && shares.length > 0 && (
          <ul className="max-h-96 space-y-2 overflow-y-auto">
            {shares.map((share) => {
              const isExpired = !!share.expiresAt && new Date(share.expiresAt) < new Date();
              const isActive = !share.revokedAt && !isExpired;

              return (
                <li
                  key={share.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {share.unitIds.length} unit{share.unitIds.length === 1 ? "" : "s"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {new Date(share.createdAt).toLocaleDateString()}
                      {share.revokedAt
                        ? " · Revoked"
                        : isExpired
                          ? " · Expired"
                          : share.expiresAt
                            ? ` · Expires ${new Date(share.expiresAt).toLocaleString()}`
                            : " · No expiry"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {isActive && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(share.token)}
                        >
                          Copy link
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevoke(share.token)}
                          disabled={revokeShare.isPending}
                        >
                          Revoke
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
