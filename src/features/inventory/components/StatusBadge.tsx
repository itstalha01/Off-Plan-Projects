import { Badge } from "@/components/ui/badge";
import { unitStatusMeta } from "../constants/unit-statuses";

export function StatusBadge({ status }: { status: string }) {
  const meta = unitStatusMeta(status);
  return (
    <Badge variant="outline" className={meta.color}>
      {meta.label}
    </Badge>
  );
}
