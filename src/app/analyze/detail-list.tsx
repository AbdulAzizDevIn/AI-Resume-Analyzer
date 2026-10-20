import { JdMatchResult } from "@/lib/ai-schema";

type RequirementItem =
  | JdMatchResult["requirementAnalysis"]["matchedRequirements"][number]
  | JdMatchResult["requirementAnalysis"]["missingRequiredRequirements"][number]
  | JdMatchResult["requirementAnalysis"]["learningGaps"][number];

type DetailListProps = {
  title: string;
  items: RequirementItem[];
  variant: "matched" | "missing" | "learning";
};

export default function DetailList({ title, items, variant }: DetailListProps) {
  const itemStyle =
    variant === "matched"
      ? "border-l-emerald-500"
      : variant === "missing"
        ? "border-l-rose-500"
        : "border-l-amber-500";

  return (
    <div>
      <h3 className="mb-3 font-semibold text-slate-800">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No items to display.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => {
            const detail = item.evidence ?? item.reason ?? item.explanation;

            return (
              <li
                key={`${item.requirement}--${index}`}
                className={`border-l-2 pl-3 ${itemStyle}`}
              >
                <p className="text-sm font-medium text-slate-800">
                  {item.requirement}
                </p>

                <p className="mt-1 text-sm text-slate-600">{detail}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
