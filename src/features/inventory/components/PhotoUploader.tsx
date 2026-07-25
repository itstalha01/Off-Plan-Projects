"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { nanoid } from "nanoid";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAddPhoto, useRemovePhoto, useUnit } from "../api/use-units";
import { PhotoLightbox } from "./PhotoLightbox";

export function PhotoUploader({ unitId }: { unitId: string }) {
  const { data: unit } = useUnit(unitId);
  const addPhoto = useAddPhoto(unitId);
  const removePhoto = useRemovePhoto(unitId);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploadingCount(files.length);
    try {
      for (const file of Array.from(files)) {
        const blob = await upload(`inventory/${unitId}/${nanoid()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/inventory/blob/upload",
        });
        await addPhoto.mutateAsync(blob.url);
      }
    } catch {
      toast.error("Couldn't upload one or more photos. Please try again.");
    } finally {
      setUploadingCount(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(e: React.MouseEvent, photoId: string) {
    e.stopPropagation();
    try {
      await removePhoto.mutateAsync(photoId);
    } catch {
      toast.error("Couldn't delete this photo. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto">
        {unit?.photos.map((photo, i) => (
          <div
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.blobUrl} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={(e) => handleDelete(e, photo.id)}
              disabled={removePhoto.isPending}
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Delete photo"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}

        {Array.from({ length: uploadingCount }).map((_, i) => (
          <div
            key={`uploading-${i}`}
            className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border bg-muted"
          >
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>

      {unit && unit.photos.length > 0 && lightboxIndex !== null && (
        <PhotoLightbox
          items={unit.photos.map((photo) => ({ src: photo.blobUrl }))}
          index={lightboxIndex}
          onIndex={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
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
        <Upload className="size-3.5" /> Add photos
      </Button>
    </div>
  );
}
