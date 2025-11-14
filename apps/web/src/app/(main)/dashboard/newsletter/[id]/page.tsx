import { Button } from "@/components/ui/button";
import { getNewsletterById } from "@/lib/newsletters";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type params = {
  params: { id: string };
};

function renderInline(text: string) {
  // inline tags with backticks like `good first issue`, bold **text** and links [text](url)
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);
  return parts.flatMap((part, idx) => {
    // backtick tag -> render as pill/tag
    if (/^`[^`]+`$/.test(part)) {
      const inner = part.slice(1, -1);
      return (
        <span
          key={`tag-${idx}`}
          className="inline-flex items-center bg-ox-purple/10 text-ox-purple px-2 py-0.5 rounded-full text-xs font-medium"
        >
          {inner}
        </span>
      );
    }

    // handle links inside non-backtick segments
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return boldParts.map((bp, j) => {
      if (/^\*\*/.test(bp)) {
        const inner = bp.replace(/\*\*/g, "");
        return (
          <strong key={`b-${idx}-${j}`} className="text-ox-white font-semibold">
            {inner}
          </strong>
        );
      }

      // handle multiple links in the segment
      const nodes: any[] = [];
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = linkRegex.exec(bp)) !== null) {
        const [matchText, t, url] = m;
        const index = m.index;
        if (index > lastIndex) nodes.push(bp.slice(lastIndex, index));
        nodes.push(
          <a
            key={`a-${idx}-${j}-${index}`}
            href={url}
            className="text-ox-purple underline"
            target="_blank"
            rel="noreferrer"
          >
            {t}
          </a>
        );
        lastIndex = index + matchText.length;
      }
      if (lastIndex < bp.length) nodes.push(bp.slice(lastIndex));

      return (
        <span key={`s-${idx}-${j}`}>
          {nodes.map((n, k) =>
            typeof n === "string" ? <span key={k}>{n}</span> : n
          )}
        </span>
      );
    });
  });
}

function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const nodes: any[] = [];
  let listBuffer: string[] = [];
  let blockquoteBuffer: string[] = [];

  function flushList() {
    if (listBuffer.length) {
      nodes.push(
        <ul
          key={`ul-${nodes.length}`}
          className="list-disc pl-6 space-y-1 text-ox-white"
        >
          {listBuffer.map((li, i) => (
            <li key={i}>{renderInline(li.replace(/^-\s*/, ""))}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  }

  lines.forEach((raw, idx) => {
    if (raw === "__CONSUMED__") return;
    const line = raw.trim();
    // handle code blocks
    if (line.startsWith("```")) {
      flushList();
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      let j = idx + 1;
      while (j < lines.length && !lines[j].trim().startsWith("```")) {
        codeLines.push(lines[j]);
        j++;
      }
      const codeContent = codeLines.join("\n");
      if (lang === "embed") {
        // embed block expects a URL in the content
        const src = codeContent.trim();
        try {
          const url = new URL(src);
          if (!["http:", "https:"].includes(url.protocol)) {
            console.warn("Invalid embed URL protocol:", src);
            return; // skip this embed
          }
        } catch {
          console.warn("Invalid embed URL:", src);
        }
        nodes.push(
          <div key={`embed-${idx}`} className="my-4 w-full">
            <div className="relative" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={src}
                title={src}
                className="absolute top-0 left-0 w-full h-full rounded-md"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );
      } else {
        nodes.push(
          <pre
            key={`code-${idx}`}
            className="my-4 overflow-auto rounded-md bg-[#0b0b0c] p-3 text-sm"
          >
            <code>{codeContent}</code>
          </pre>
        );
      }
      // replace consumed lines with empties so outer loop sees them as blank and skips
      for (let k = idx; k <= j; k++) {
        lines[k] = "__CONSUMED__";
      }
      return;
    }
    if (!line) {
      flushList();
      if (blockquoteBuffer.length) {
        nodes.push(
          <blockquote
            key={`bq-${idx}`}
            className="border-l-4 pl-4 italic text-ox-white/80 my-3"
          >
            {blockquoteBuffer.map((l, i) => (
              <p key={i} className="m-0 py-1">
                {renderInline(l.replace(/^>\s?/, ""))}
              </p>
            ))}
          </blockquote>
        );
        blockquoteBuffer = [];
      }
      return nodes.push(<p key={idx} className="py-2" />);
    }
    // heading 1
    if (line.startsWith("# ")) {
      flushList();
      nodes.push(
        <h1 key={idx} className="text-4xl font-bold text-ox-white mb-2">
          {renderInline(line.replace(/^#\s+/, ""))}
        </h1>
      );
      return;
    }
    // heading 2
    if (line.startsWith("## ")) {
      flushList();
      nodes.push(
        <h2 key={idx} className="text-3xl font-semibold text-ox-white mb-2">
          {renderInline(line.replace(/^##\s+/, ""))}
        </h2>
      );
      return;
    }
    // heading 3
    if (line.startsWith("### ")) {
      flushList();
      nodes.push(
        <h3 key={idx} className="text-2xl font-semibold text-ox-white mb-2">
          {renderInline(line.replace(/^###\s+/, ""))}
        </h3>
      );
      return;
    }
    // blockquote
    if (line.startsWith("> ") || line === ">") {
      blockquoteBuffer.push(raw);
      return;
    }

    // image
    const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      flushList();
      if (blockquoteBuffer.length) {
        nodes.push(
          <blockquote
            key={`bq-img-${idx}`}
            className="border-l-4 pl-4 italic text-ox-white/80 my-3"
          >
            {blockquoteBuffer.map((l, i) => (
              <p key={i} className="m-0 py-1">
                {renderInline(l.replace(/^>\s?/, ""))}
              </p>
            ))}
          </blockquote>
        );
        blockquoteBuffer = [];
      }
      const [, alt, url] = imgMatch;
      try {
        const imgUrl = new URL(url);
        if (!["http:", "https:", "data:"].includes(imgUrl.protocol)) {
          console.warn("Invalid image URL protocol:", url);
          return; // Skip this image
        }
      } catch (error) {
        // Relative URLs are OK, will throw but we can allow them
        if (!url.startsWith("/") && !url.startsWith("./")) {
          console.warn("Invalid image URL:", url);
          return;
        }
      }
      nodes.push(
        <div key={idx} className="my-4">
          <img
            src={url}
            alt={alt}
            className="w-full max-h-[500px] max-w-[1200px] rounded-md object-cover"
          />
        </div>
      );
      return;
    }
    // list
    if (line.startsWith("- ")) {
      listBuffer.push(line);
      return;
    }

    // paragraph
    flushList();
    if (blockquoteBuffer.length) {
      nodes.push(
        <blockquote
          key={`bq-par-${idx}`}
          className="border-l-4 pl-4 italic text-ox-white/80 my-3"
        >
          {blockquoteBuffer.map((l, i) => (
            <p key={i} className="m-0 py-1">
              {renderInline(l.replace(/^>\s?/, ""))}
            </p>
          ))}
        </blockquote>
      );
      blockquoteBuffer = [];
    }
    nodes.push(
      <p key={idx} className="text-gray-300 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });

  flushList();
  return nodes;
}

export default function NewsletterArticle({ params }: params) {
  const id = params.id;
  const item = getNewsletterById(id);
  if (!item) {
    return <div className="p-6 text-ox-white">newsletter not found</div>;
  }

  return (
    <div className="p-6 min-h-screen rounded-lg mx-1 md:mx-4 bg-ox-black-1 ">
      <Link
        href={"/dashboard/newsletter"}
        className="inline-flex items-center gap-2 mb-3 text-ox-white/90 hover:text-ox-white"
      >
        <ChevronLeft />
        Back
      </Link>
      <div className="text-ox-gray mb-6">
        {new Date(item.date).toLocaleDateString()}
      </div>
      <article className="prose prose-invert">
        {renderMarkdown(item.content)}
      </article>
      <div className="flex justify-center mt-3">
        <Link href={"/dashboard/newsletter"}>
          <Button>view all newsletters</Button>
        </Link>
      </div>
    </div>
  );
}
