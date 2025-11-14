import NewsletterCard from "./newsletter-card";
import { groupByMonth, type newsletter } from "@/lib/newsletters";

type props = {
  items: newsletter[];
};

// function groupByMonth(items: newsletter[]) {
//   const map: Record<string, newsletter[]> = {};
//   items.forEach((it) => {
//     const d = new Date(it.date);
//     if (isNaN(d.getTime())) {
//       console.warn(`Invalid date for newsletter fit.id}:`, it.date);
//       return;
//     }
//     const key = d.toLocaleString("default", { month: "long", year: "numeric" });
//     if (!map[key]) map[key] = [];
//     map[key].push(it);
//   });
//   return map;
// }

export default function NewsletterList({ items }: props) {
  const grouped = groupByMonth(items);
  const months = Object.keys(grouped).sort((a, b) => (a > b ? 1 : -1));

  return (
    <div className="space-y-8">
      {months.map((m) => (
        <section key={m}>
          <h2 className="text-2xl text-ox-white font-semibold mb-4">{m}</h2>
          <div className="flex gap-4">
            {grouped[m].map((n) => (
              <NewsletterCard
                key={n.id}
                id={n.id}
                title={n.title}
                date={n.date}
                excerpt={n.excerpt}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
