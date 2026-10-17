import Link from "next/link";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type AnalysisPageProps = {
  params: Promise<{ id: string }>;
};

type RequirementCategory =
  | "hardSkills"
  | "softSkills"
  | "experience"
  | "education";

type Requirement = {
  requirement: string;
  category: RequirementCategory;
  evidence?: string;
  reason?: string;
  explanation?: string;
};

type AnalysisResult = {
  categoryScores: {
    hardSkillsMatch: number;
    softSkillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
  };
  keywordAnalysis: {
    matchedKeywords: string[];
    missingRequiredSkills: string[];
    missingBonusSkills: string[];
  };
  requirementAnalysis: {
    matchedRequirements: Requirement[];
    missingRequiredRequirements: Requirement[];
    learningGaps: Requirement[];
  };
  gapAnalysis: {
    experienceGap: string | null;
    educationGap: string | null;
    jobTitleMatch: {
      jdTitle: string;
      resumeTitle: string | null;
      assessment: string;
    };
  };
  contextualAlignment: {
    jdRequirement: string;
    resumeProof: string | null;
    suggestion: string;
  }[];
  quickFixes: string[];
};

const categories = [
  { key: "hardSkillsMatch", label: "Hard Skills" },
  { key: "softSkillsMatch", label: "Soft Skills" },
  { key: "experienceMatch", label: "Experience" },
  { key: "educationMatch", label: "Education" },
] as const;

function DetailList({
  title,
  items,
  variant,
}: {
  title: string;
  items: Requirement[];
  variant: "matched" | "missing" | "learning";
}) {
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
                key={`${item.requirement}-${index}`}
                className={`border-l-2 pl-3 ${itemStyle}`}
              >
                <p className="text-sm font-medium text-slate-800">
                  {item.requirement}
                </p>

                {detail && (
                  <p className="mt-1 text-sm text-slate-600">{detail}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function KeywordGroup({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "danger" | "warning";
}) {
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

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;

  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const analysis = await prisma.analysis.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      resume: {
        select: {
          fileName: true,
        },
      },
      jobDescription: {
        select: {
          title: true,
          company: true,
        },
      },
    },
  });

  if (!analysis) {
    notFound();
  }

  const result = analysis.result as unknown as AnalysisResult;

  const overallScore = Math.min(100, Math.max(0, analysis.matchScore));

  const categoryScores = categories.map((category) => ({
    label: category.label,
    score: Math.min(100, Math.max(0, result.categoryScores[category.key])),
  }));

  const { matchedRequirements, missingRequiredRequirements, learningGaps } =
    result.requirementAnalysis;

  const { matchedKeywords, missingRequiredSkills, missingBonusSkills } =
    result.keywordAnalysis;

  const { experienceGap, educationGap, jobTitleMatch } = result.gapAnalysis;

  const hasRequirementData =
    matchedRequirements.length > 0 ||
    missingRequiredRequirements.length > 0 ||
    learningGaps.length > 0;

  const hasKeywordData =
    matchedKeywords.length > 0 ||
    missingRequiredSkills.length > 0 ||
    missingBonusSkills.length > 0;

  const hasGapDetails = Boolean(
    experienceGap ||
    educationGap ||
    jobTitleMatch.assessment ||
    jobTitleMatch.resumeTitle,
  );

  const hasDetailedAnalysis = result.contextualAlignment.length > 0;

  const topQuickFixes = result.quickFixes.slice(0, 3);
  const remainingQuickFixes = result.quickFixes.slice(3);

  const isEntryLevel =
    /\b(intern|internship|junior|fresher|entry.level|trainee)\b/i.test(
      analysis.jobDescription.title,
    );

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        {/* Header */}
        <header>
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-indigo-600"
          >
            &larr; Back to Dashboard
          </Link>

          <div className="mt-5 border-b border-slate-200 pb-5">
            <p className="text-sm text-slate-500">Resume Analysis</p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {analysis.jobDescription.title}
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              {analysis.jobDescription.company || "Company not specified"}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span>Resume: {analysis.resume.fileName}</span>

              <span>
                Analyzed on{" "}
                {analysis.createdAt.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Score Overview */}
        <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Match Score</h2>

          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="sm:min-w-40">
              <p className="text-4xl font-bold text-indigo-600">
                {overallScore}%
              </p>

              <p className="mt-1 text-sm text-slate-500">Overall Match</p>
            </div>

            <div className="w-full space-y-4">
              {categoryScores.map((category) => (
                <div key={category.label}>
                  <div className="mb-1 flex justify-between gap-3 text-sm">
                    <span className="text-slate-700">{category.label}</span>

                    <span className="font-medium text-slate-900">
                      {category.score}%
                    </span>
                  </div>

                  <div
                    className="h-2 overflow-hidden rounded bg-slate-100"
                    role="progressbar"
                    aria-label={category.label}
                    aria-valuenow={category.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full rounded bg-indigo-600"
                      style={{
                        width: `${category.score}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Fixes */}
        {result.quickFixes.length > 0 && (
          <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Improvements
            </h2>

            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
              {topQuickFixes.map((fix, index) => (
                <li key={`${fix}-${index}`}>{fix}</li>
              ))}
            </ol>

            {remainingQuickFixes.length > 0 && (
              <details className="mt-4 border-t border-slate-200 pt-3">
                <summary className="cursor-pointer text-sm font-medium text-indigo-600">
                  Show more suggestions ({remainingQuickFixes.length})
                </summary>

                <ol
                  start={4}
                  className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700"
                >
                  {remainingQuickFixes.map((fix, index) => (
                    <li key={`${fix}-${index}`}>{fix}</li>
                  ))}
                </ol>
              </details>
            )}
          </section>
        )}

        {/* Requirement Summary */}
        {hasRequirementData && (
          <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Requirement Summary
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-2xl font-semibold text-emerald-700">
                  {matchedRequirements.length}
                </p>
                <p className="mt-1 text-sm text-emerald-800">Matched</p>
              </div>

              <div className="rounded-lg bg-rose-50 p-4">
                <p className="text-2xl font-semibold text-rose-700">
                  {missingRequiredRequirements.length}
                </p>
                <p className="mt-1 text-sm text-rose-800">
                  Missing Requirements
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-2xl font-semibold text-amber-700">
                  {learningGaps.length}
                </p>
                <p className="mt-1 text-sm text-amber-800">Learning Gaps</p>
              </div>
            </div>

            {isEntryLevel && (
              <p className="mt-4 text-sm text-slate-600">
                For entry-level roles, relevant projects, coursework and
                transferable skills can help demonstrate your potential.
              </p>
            )}

            <details className="mt-5 border-t border-slate-200 pt-4">
              <summary className="cursor-pointer text-sm font-medium text-indigo-600">
                View requirement breakdown
              </summary>

              <div className="mt-5 space-y-6">
                <DetailList
                  title="Matched Requirements"
                  items={matchedRequirements}
                  variant="matched"
                />

                <DetailList
                  title="Missing Required Requirements"
                  items={missingRequiredRequirements}
                  variant="missing"
                />

                <DetailList
                  title="Learning Gaps"
                  items={learningGaps}
                  variant="learning"
                />
              </div>
            </details>
          </section>
        )}

        {/* Keyword Analysis */}
        {hasKeywordData && (
          <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <details>
              <summary className="cursor-pointer text-lg font-semibold text-slate-900">
                Keyword Analysis
              </summary>

              <div className="mt-5 space-y-5">
                <KeywordGroup
                  title="Matched Keywords"
                  items={matchedKeywords}
                  tone="success"
                />

                <KeywordGroup
                  title="Missing Required Skills"
                  items={missingRequiredSkills}
                  tone="danger"
                />

                <KeywordGroup
                  title="Bonus Skills to Consider"
                  items={missingBonusSkills}
                  tone="warning"
                />
              </div>
            </details>
          </section>
        )}

        {/* Experience and Education */}
        {hasGapDetails && (
          <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <details>
              <summary className="cursor-pointer text-lg font-semibold text-slate-900">
                Experience &amp; Education
              </summary>

              <div className="mt-5 space-y-5">
                {(jobTitleMatch.jdTitle ||
                  jobTitleMatch.resumeTitle ||
                  jobTitleMatch.assessment) && (
                  <div>
                    <h3 className="font-medium text-slate-800">
                      Job Title Match
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Job title:</span>{" "}
                      {jobTitleMatch.jdTitle}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-medium">Resume title:</span>{" "}
                      {jobTitleMatch.resumeTitle || "Not specified"}
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {jobTitleMatch.assessment}
                    </p>
                  </div>
                )}

                {experienceGap && (
                  <div>
                    <h3 className="font-medium text-slate-800">
                      Experience Gap
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {experienceGap}
                    </p>
                  </div>
                )}

                {educationGap && (
                  <div>
                    <h3 className="font-medium text-rose-700">Education Gap</h3>
                    <p className="mt-1 text-sm text-rose-600">{educationGap}</p>
                  </div>
                )}
              </div>
            </details>
          </section>
        )}

        {/* Resume Evidence and Recommendations */}
        {hasDetailedAnalysis && (
          <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <details>
              <summary className="cursor-pointer text-lg font-semibold text-slate-900">
                Resume Evidence &amp; Recommendations
              </summary>

              <div className="mt-5 space-y-5">
                {result.contextualAlignment.map((item, index) => (
                  <div
                    key={`${item.jdRequirement}-${index}`}
                    className="border-b border-slate-100 pb-4 last:border-0"
                  >
                    <h3 className="font-medium text-slate-800">
                      {item.jdRequirement}
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Resume evidence:</span>{" "}
                      {item.resumeProof || "No direct evidence found."}
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Recommendation:</span>{" "}
                      {item.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </section>
        )}

        <footer className="border-t border-slate-200 pt-4 text-xs text-slate-400">
          Analysis ID: {analysis.id}
        </footer>
      </div>
    </main>
  );
}
