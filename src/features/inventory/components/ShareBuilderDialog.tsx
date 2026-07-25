"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateShare } from "../api/use-shares";
import { ALL_SHAREABLE_FIELD_KEYS, SHAREABLE_FIELDS } from "../constants/shareable-fields";
import { useInventorySelectionStore } from "../store/inventory-selection-store";

export function ShareBuilderDialog() {
  const selectedIds = useInventorySelectionStore((s) => s.selectedIds);
  const clearSelection = useInventorySelectionStore((s) => s.clear);
  const createShare = useCreateShare();

  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<Set<string>>(new Set(ALL_SHAREABLE_FIELD_KEYS));
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const count = selectedIds.size;
  if (count === 0) return null;

  function toggleField(key: string) {
    setFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setShareUrl(null);
      setFields(new Set(ALL_SHAREABLE_FIELD_KEYS));
    }
  }

  async function handleGenerate() {
    try {
      const share = await createShare.mutateAsync({
        unitIds: Array.from(selectedIds),
        fields: Array.from(fields),
      });
      setShareUrl(`${window.location.origin}/inventory/share/${share.token}`);
    } catch {
      toast.error("Couldn't create the share link. Please try again.");
    }
  }

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied");
  }

  function handleDone() {
    clearSelection();
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className={buttonVariants()}>
        <Share2 className="size-3.5" /> Share {count} unit{count === 1 ? "" : "s"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {count} unit{count === 1 ? "" : "s"}</DialogTitle>
        </DialogHeader>

        {shareUrl ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              View-only link — anyone with it can see the selected units and fields.
            </p>
            <div className="flex gap-2">
              <Input readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
              <Button type="button" onClick={handleCopy}>
                Copy
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Choose which fields to show. Everything is shown by default.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SHAREABLE_FIELDS.map((field) => (
                <label key={field.key} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={fields.has(field.key)}
                    onCheckedChange={() => toggleField(field.key)}
                  />
                  {field.label}
                </label>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          {shareUrl ? (
            <Button onClick={handleDone}>Done</Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={createShare.isPending || fields.size === 0}
            >
              {createShare.isPending ? "Generating…" : "Generate link"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
