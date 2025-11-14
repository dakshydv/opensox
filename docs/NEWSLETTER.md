# newsletter

This document explains how to add or update a newsletter entry. Keep content concise and focused.

Location

- Source: `apps/web/src/lib/newsletters.ts`
- Components: `apps/web/src/components/newsletter/newsletter-list.tsx` and `apps/web/src/components/newsletter/newsletter-card.tsx`
- Pages: `apps/web/src/app/(main)/dashboard/newsletter/page.tsx` and `apps/web/src/app/(main)/dashboard/newsletter/[id]/page.tsx`

Structure

- Type (see `apps/web/src/lib/newsletters.ts`):
  - `id: string` — unique id, recommended format `yyyy-mm-dd-short-title`.
  - `title: string` — article title.
  - `date: string` — ISO date string (`yyyy-mm-dd`).
  - `excerpt?: string` — short one-line excerpt (optional).
  - `content: string` — markdown content (see supported features below).

Supported content

- Full markdown is supported in practice (headings, code fences, inline code, bold/italic, links, images, lists). Examples used in the codebase include:
  - Headings: `#`, `##`, `###`
  - Bold: `**bold**`
  - Inline code: `` `example` ``
  - Code blocks: triple backticks (```)
  - Links: `[text](url)`
  - Images: `![alt](url)`
  - Bullet lists starting with `- `
  - Emojis and short HTML-like separators (e.g. `---`) are used in current entries.

Helpers

- `getAllNewslettersSorted()` — returns all newsletters sorted newest first (used by the listing page).
- `getNewsletterById(id)` — returns a single newsletter by `id` (used by the article page).

Adding a newsletter

1. Open `apps/web/src/lib/newsletters.ts`.
2. Add a new item to the `newsletters` array. Use an `id` like `yyyy-mm-dd-short-title` (must be unique).
3. Set `date` to the ISO `yyyy-mm-dd` format.
4. Add an `excerpt` if you want a custom preview text (optional).
5. Put the article body in `content` using markdown (you may use code fences and images).
6. Create a PR that describes the newsletter and includes any screenshots or a short screen recording of the flow (optional but helpful).

Notes about the UI and access

- Newsletters are grouped in the UI by month and year, newest first.
- The listing page includes client-side search (searches title, excerpt, and content).
- Access: newsletters are shown to premium subscribers in the app. The UI checks subscription state before rendering full content.

Routes / Preview

- List: `/dashboard/newsletter`
- Article: `/dashboard/newsletter/:id` (example: `/dashboard/newsletter/2025-10-10-ai-in-open-source`)

Tips

- Keep the `excerpt` short and descriptive for listing previews.
- Use code fences for any multi-line code examples.
- Prefer externally hosted images (the examples use Unsplash URLs).
- If your content contains sensitive or private information, do not add it to this file — newsletters are committed to the repo and public in the deployed site for subscribers.