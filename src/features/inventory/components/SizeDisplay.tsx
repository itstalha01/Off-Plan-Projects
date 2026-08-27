import { formatDimensions, formatSize } from "../lib/size";

export function SizeDisplay({
  areaSqft,
  frontFt,
  depthFt,
}: {
  areaSqft: number;
  frontFt?: number | null;
  depthFt?: number | null;
}) {
  const dimensions = formatDimensions(frontFt, depthFt);
  return (
    <span>
      {formatSize(areaSqft)}
      {dimensions ? <span className="text-muted-foreground"> ({dimensions})</span> : null}
    </span>
  );
}
