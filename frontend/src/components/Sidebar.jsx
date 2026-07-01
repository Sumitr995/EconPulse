import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addItem, removeItem } from "@/api";

function ChipList({ title, items, listKey, onUpdate }) {
  const [value, setValue] = useState("");

  const handleAdd = async () => {
    if (!value.trim()) return;
    try {
      await addItem(listKey, value.trim());
      setValue("");
      onUpdate();
    } catch {
      alert(`Failed to add "${value.trim()}". It may already exist or the server is unavailable.`);
    }
  };

  const handleRemove = async (val) => {
    try {
      await removeItem(listKey, val);
      onUpdate();
    } catch {
      alert(`Failed to remove "${val}". Please try again.`);
    }
  };

  return (
    <div className="border border-slate-200 bg-white p-3">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{title}</h3>
      <div className="mb-3 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleRemove(item)}
              className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
              title="Remove"
            >
              {item} ×
            </button>
          ))
        ) : (
          <p className="text-sm text-slate-500">Nothing added yet.</p>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={`Add ${title.toLowerCase()}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="h-9 border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400"
        />
        <Button
          size="sm"
          onClick={handleAdd}
          className="h-9 rounded-sm border border-slate-200 bg-white px-3 text-xs text-slate-700 hover:bg-slate-50"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default function Sidebar({ config, onUpdate }) {
  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">EconPulse</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">Focus on what matters</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Tracking {config.country} with a simple, editorial view.</p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="border border-slate-200 bg-white p-3">
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Sections</h3>
          <div className="space-y-1.5 text-sm text-slate-700">
            {['For you', 'Business', 'Markets', 'Policy', 'Technology'].map((item) => (
              <div key={item} className="px-2 py-1.5 hover:bg-slate-50">
                {item}
              </div>
            ))}
          </div>
        </div>

        <ChipList title="Topics" items={config.topics} listKey="topics" onUpdate={onUpdate} />
        <ChipList title="Sources" items={config.sources} listKey="sources" onUpdate={onUpdate} />
        <ChipList title="Competitors" items={config.competitors} listKey="competitors" onUpdate={onUpdate} />
      </div>
    </aside>
  );
}
