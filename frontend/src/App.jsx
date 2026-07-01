import { useCallback, useEffect, useMemo, useState } from "react";
import { getConfig, runNews } from "@/api";
import Sidebar from "@/components/Sidebar";
import NewsFeed from "@/components/NewsFeed";
import { Button } from "@/components/ui/button";

const defaultConfig = { country: "India", topics: [], sources: [], competitors: [] };
const sections = [
  { id: "for-you", label: "For you" },
  { id: "business", label: "Business" },
  { id: "markets", label: "Markets" },
  { id: "policy", label: "Policy" },
  { id: "tech", label: "Technology" },
];

export default function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("for-you");

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [cfg, data] = await Promise.all([getConfig(), runNews()]);
      setConfig(cfg || defaultConfig);
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setConfig(defaultConfig);
      setArticles([]);
      setError("Live data is temporarily unavailable. The dashboard is ready for local review.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const featured = useMemo(() => articles[0] || null, [articles]);

  return (
    <div className="min-h-screen bg-[#f3f5f7] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
        <Sidebar config={config} onUpdate={refreshDashboard} />

        <main className="flex-1">
          <header className="mb-4 flex flex-col gap-3 border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">EconPulse</p>
              <h1 className="mt-1 text-xl font-semibold text-slate-900">Top stories</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                {config.country}
              </div>
              <Button
                onClick={refreshDashboard}
                disabled={loading}
                className="rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </header>

          <div className="mb-4 flex flex-wrap gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`border px-3 py-2 text-sm transition ${
                  activeSection === section.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {error ? (
            <div className="mb-4 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {error}
            </div>
          ) : null}

          {featured ? (
            <section className="mb-4 border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                Featured story
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-semibold leading-tight text-slate-900">{featured.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {featured.summary || "A concise summary will appear here once the feed returns detailed copy."}
                  </p>
                </div>
                <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  {featured.source || "Live feed"} • {featured.category || "News"}
                </div>
              </div>
            </section>
          ) : null}

          <section className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                Latest updates
              </h2>
              <span className="text-sm text-slate-500">{articles.length} stories</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-20 border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
                    <div className="h-3 w-24 bg-slate-200" />
                    <div className="mt-2 h-4 w-full bg-slate-100" />
                    <div className="mt-2 h-4 w-3/4 bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : (
              <NewsFeed articles={articles} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
