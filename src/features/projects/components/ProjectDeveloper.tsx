import type { Project } from "../types/project";

export function ProjectDeveloper({ project }: { project: Project }) {
  const dev = project.developer;
  if (!dev) return null;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-serif text-xl font-semibold text-ink">{dev.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-brown sm:text-base">
          {dev.blurb}
        </p>
      </div>

      {dev.stats && dev.stats.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {dev.stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-cream p-3 text-center">
              <p className="font-serif text-lg font-semibold text-ink">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-brown">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {dev.trackRecord && dev.trackRecord.length > 0 && (
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brown">
            Track record
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {dev.trackRecord.map((p) => (
              <span
                key={p}
                className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-brown"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
