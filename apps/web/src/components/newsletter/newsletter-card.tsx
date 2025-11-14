import Link from "next/link";
import { Calendar } from "lucide-react";

type props = {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
};

export default function NewsletterCard({ id, title, date, excerpt }: props) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Link
      href={`/dashboard/newsletter/${id}`}
      className="border border-ox-gray hover:cursor-pointer w-full max-w-sm rounded-lg p-5 bg-ox-black-2 hover:border-ox-purple-2 transition-colors"
    >
      <div className="flex items-center gap-2 text-sm mb-3 text-ox-gray">
        <Calendar className="w-4 h-4 text-ox-gray" />
        <span>{formattedDate}</span>
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-ox-white mb-2 leading-tight">
        <Link
          href={`/dashboard/newsletter/${id}`}
          className="hover:text-ox-purple-2"
        >
          {title}
        </Link>
      </h3>
      {excerpt && (
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      )}
    </Link>
  );
}
