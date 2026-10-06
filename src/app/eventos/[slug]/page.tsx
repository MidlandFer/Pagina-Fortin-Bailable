import { notFound } from "next/navigation";
import PurchaseForm from "@/components/PurchaseForm";
import { events, formatDate, getEvent } from "@/lib/events";

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export default async function EventPage({
  params,
}: PageProps<"/eventos/[slug]">) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">
        {formatDate(event.date)}
      </p>
      <h1 className="mt-2 text-4xl font-extrabold text-brand">{event.title}</h1>
      <p className="mt-3 text-foreground/70">{event.description}</p>
      <div className="mt-8">
        <PurchaseForm event={event} />
      </div>
    </main>
  );
}
