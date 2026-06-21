/** A titled section block, shared by every project sub-page so headings,
 *  spacing and scroll offset stay consistent. */
export function ProjectSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-8">
      <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
