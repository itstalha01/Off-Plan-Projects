import { formatSize } from "../lib/size";

export function SizeDisplay({
  areaSqft,
  frontFt,
  depthFt,
}: {
  areaSqft: number;
  frontFt?: number | null;
  depthFt?: number | null;
}) {
  return (
    <span>
      {formatSize(areaSqft)}
      {frontFt && depthFt ? (
        <span className="text-muted-foreground"> ({frontFt}x{depthFt})</span>
      ) : null}
    </span>
  );
}
