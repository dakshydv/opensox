export type newsletter = {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  content: string; // markdown
};

export const newsletters: newsletter[] = [
  {
    id: "2025-10-10-ai-in-open-source",
    title: "How AI is reshaping open-source development",
    date: "2025-10-10",
    excerpt:
      "From automated reviews to semantic search — how AI is transforming contributor workflows and community growth.",
    content: `# 🤖 How AI Is Reshaping Open-Source Development

![ai-dev](https://images.unsplash.com/photo-1535223289827-42f1e9919769)

AI isn't just assisting developers — it's becoming a core part of how open-source projects scale, collaborate, and maintain quality.

---

## ⚡ This Week’s Highlights

- GitHub rolls out \`ai-powered triage\` for community issues  
- \`semantic search\` added to multiple large OSS repos  
- Bun introduces **AI-accelerated runtime hints**  
- Read more: [AI and OSS — The New Era](https://example.com)

---

## 🧠 Deep Dive — AI as Your Co-Maintainer

### What AI Can Already Do

- Suggest PR comments using \`contextual review\`  
- Auto-label issues with \`topic detection\`  
- Identify flaky tests  
- Generate documentation from commit history

![review-bot](https://images.unsplash.com/photo-1515879218367-8466d910aaa4)

### Why Maintainers Love It

AI removes 30–50% of manual workflow overhead:

- Faster backlog cleanup  
- Better contributor onboarding  
- High-quality review signals  
- Reduced time to merge  

---

## 🚀 Contribute This Week

- \`good first issue\` — Improve AI prompt templates  
- Add retry logic to API calls  
- Write auto-generated schema docs  
- Improve error logs for observability  
- Read: [Scaling OSS with AI](https://example.com/ai)

---

## 🛠 Tool of the Week — CodePilot

![codepilot](https://images.unsplash.com/photo-1505685296765-3a2736de412f)

CodePilot brings realtime AI code search with unmatched accuracy.

**Features:**

- \`neural indexing\`  
- Instant dependency graphing  
- Natural language queries  
- Works across monorepos

---

## 📝 Final Thoughts

AI isn’t replacing open-source — it’s **amplifying it**.  
Your role as a contributor is more powerful than ever.

See you next week! ✨`,
  },
  {
    id: "2025-11-08-open-source-community-growth",
    title: "Building strong open-source communities",
    date: "2025-11-08",
    excerpt:
      "How maintainers build inclusive, impactful communities — and the patterns that help projects grow beyond 10k stars.",
    content: `# 🌱 Building Strong Open-Source Communities

![community](https://images.unsplash.com/photo-1522071820081-009f0129c71c)

Behind every great open-source project is a supportive, structured, and welcoming community.

---

## 💬 Quote of the Week

> “the strength of an open-source project isn’t just its code —  
> it’s the people who choose to build it together.”

---

## 💡 Highlights of the Week

- Discord adds \`dev forums\` for OSS teams  
- GitHub Sponsors hits **$1M/day**  
- New OSS governance templates released  
- Read more: [How Communities Scale](https://example.com)

---

## 🌍 Deep Dive — What Makes Great Communities?

### The Three Pillars

- Clear contribution rules  
- Transparent decision-making  
- \`good first issue\` pathways for beginners  

![group](https://images.unsplash.com/photo-1529156069898-49953e39b3ac)

### Maintainers Should Prioritize

- Onboarding callouts  
- Constructive PR reviews  
- Public roadmaps  
- Celebration of contributors  

---

## 🧪 Example Snippet — Auto-Tag New Contributors

Sometimes maintainers automate contributor labeling.  
Here’s a simple example:

\`\`\`ts
import { Octokit } from "octokit";

export async function tagNewContributor(repo, username) {
  const client = new Octokit({ auth: process.env.GITHUB_TOKEN });

  await client.request("POST /repos/{owner}/{repo}/issues/{issue_number}/labels", {
    owner: "opensox",
    repo,
    issue_number: 1,
    labels: ["new-contributor"]
  });
}
\`\`\`

---

## 🎯 Contribute This Week

- Create onboarding examples  
- Add \`beginner friendly\` labels to issues  
- Improve repo README structure  
- Build a FAQs page  
- Read: [Community Management 101](https://example.com/community)

---

## 🧰 Tool of the Week — ContribBoard

![board](https://images.unsplash.com/photo-1519389950473-47ba0277781c)

This tool helps maintainers organize issues visually.

**Features:**

- Kanban-style boards  
- \`priority tagging\`  
- Weekly contributor highlights  
- Automated cleanup scripts

---

## 📝 Final Thoughts

Communities don’t grow by accident — they grow by intention.  
Keep building, keep supporting, keep contributing.

Until next time! 🌟`,
  },
  {
    id: "2025-11-06-maintainer-survival-kit",
    title: "The maintainer's survival kit",
    date: "2025-11-06",
    excerpt:
      "Best practices, tooling, automation, and mindset for maintainers handling fast-growing repositories.",
    content: `# 🧰 The Maintainer’s Survival Kit

![maintainer](https://images.unsplash.com/photo-1557804506-669a67965ba0)

Maintaining a popular project is exciting — but chaotic. Here’s what helps maintainers stay sane and scalable.

---

## 🚦 Weekly Maintainer Updates

- GitHub adds \`auto cleanup\` for stale issues  
- npm introduces **dependency risk badges**  
- Deno releases streaming test runner  
- Read: [The Future of Maintenance](https://example.com)

---

## 🔎 Deep Dive — Scaling Without Burnout

### What Works

- Scheduled \`triage sessions\`  
- Automated PR labeling  
- Clear boundaries for contributions  
- Using bots for repetitive tasks  

### Tools That Save Time

- Action bots for CI  
- Semantic release workflows  
- Dependabot  
- Auto-generated changelogs  

---

## 🧩 Contribute This Week

- \`good first issue\` — Document the automation setup  
- Add CI badges  
- Simplify configuration scripts  
- Add missing unit tests  
- Read: [Maintainer Guide](https://example.com)

---

## 🛠 Tool of the Week — TaskFlow

![taskflow](https://images.unsplash.com/photo-1535223289827-42f1e9919769)

taskflow automates heavy maintainer workflows.

**Best Features:**

- \`workflow templates\`  
- Instant CI insights  
- Issue clustering  
- Scheduled automation

---

## 📝 Final Thoughts

Maintenance should feel manageable — not overwhelming.  
Automation is your best ally.

See you soon! ⚙️`,
  },
];

export function getNewsletterById(id: string) {
  return newsletters.find((n) => n.id === id);
}

export function getAllNewslettersSorted() {
  return [...newsletters].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function groupByMonth(items: newsletter[]) {
  const map: Record<string, newsletter[]> = {};
  items.forEach((it) => {
    const d = new Date(it.date);
    if (isNaN(d.getTime())) {
      console.warn(`Invalid date for newsletter fit.id}:`, it.date);
      return;
    }
    const key = d.toLocaleString("default", { month: "long", year: "numeric" });
    if (!map[key]) map[key] = [];
    map[key].push(it);
  });
  return map;
}