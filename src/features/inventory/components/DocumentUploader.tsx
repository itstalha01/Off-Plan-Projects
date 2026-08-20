"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { nanoid } from "nanoid";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAddDocument, useRemoveDocument, useUnit } from "../api/use-units";

export function DocumentUploader({ unitId }: { unitId: string }) {
  const { data: unit } = useUnit(unitId);
  const addDocument = useAddDocument(unitId);
  const removeDocument = useRemoveDocument(unitId);
  const [uploadingCount, setUploadingCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploadingCount(files.length);
    try {
      for (const file of Array.from(files)) {
        const blob = await upload(`inventory/${unitId}/documents/${nanoid()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/inventory/blob/upload",
        });
        await addDocument.mutateAsync({ blobUrl: blob.url, name: file.name });
      }
    } catch {
      toast.error("Couldn't upload one or more documents. Please try again.");
    } finally {
      setUploadingCount(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(documentId: string) {
    try {
      await removeDocument.mutateAsync(documentId);
    } catch {
      toast.error("Couldn't delete this document. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {unit && unit.documents.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {unit.documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm"
            >
              <FileText className="size-3.5 shrink-0 text-muted-foreground" />
              <a
                href={doc.blobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate hover:underline"
              >
                {doc.name}
              </a>
              <button
                type="button"
                onClick={() => handleDelete(doc.id)}
                disabled={removeDocument.isPending}
                className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                aria-label={`Delete ${doc.name}`}
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {uploadingCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-sm text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Uploading {uploadingCount} document{uploadingCount === 1 ? "" : "s"}…
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploadingCount > 0}
      >
        <Upload className="size-3.5" /> Add documents
      </Button>
    </div>
  );
}
