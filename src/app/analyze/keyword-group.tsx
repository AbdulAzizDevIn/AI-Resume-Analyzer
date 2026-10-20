type KeywordGroupProps = {
  title: string;
  items: string[];
  tone: "success" | "danger" | "warning";
};

export default function KeywordGroup({
  title,
  items,
  tone,
}: KeywordGroupProps) {
  if (items.length === 0) {
    return null;
  }

  const colors = {
    success: "bg-emerald-50 text-emerald-700",
    danger: "bg-rose-50 text-rose-700",
    warning: "bg-amber-50 text-amber-700",
  };

  return (
    <div>
      <h3 className="mb-3 font-medium text-slate-800">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={`rounded-md px-2.5 py-1 text-sm ${colors[tone]}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
