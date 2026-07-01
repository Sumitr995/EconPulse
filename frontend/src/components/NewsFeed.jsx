function formatDate(value) {
  if (!value) return "Recently published";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently published";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NewsFeed({ articles }) {
  const grouped = {};
  for (const article of articles) {
    const category = article.category || "Other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(article);
  }

  if (articles.length === 0) {
    return (
      <div className="border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
        No articles yet. Refresh to pull the latest briefing.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{category}</h3>
            <span className="text-sm text-slate-500">{items.length} stories</span>
          </div>
          <div className="space-y-3">
            {items.map((article, index) => (
              <article key={`${article.title}-${index}`} className="border-t border-slate-200 py-3 first:border-t-0 first:pt-0">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {article.source || "Source"} • {formatDate(article.publishedAt)}
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-medium leading-6 text-slate-900 hover:text-blue-700"
                >
                  {article.title}
                </a>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {article.summary || "A concise summary will appear here once the feed returns detailed copy."}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
