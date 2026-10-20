import Link from "next/link";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { MatchScoreRing } from "@/components/match-score-ring";
import type { JdMatchResult } from "@/lib/ai-schema";
import DetailList from "../detail-list";
import KeywordGroup from "../keyword-group";

type AnalysisPageProps = {
  params: Promise<{ id: string }>;
};

const categories = [
  { key: "hardSkillsMatch", label: "Hard Skills" },
  { key: "softSkillsMatch", label: "Soft Skills" },
  { key: "experienceMatch", label: "Experience" },
  { key: "educationMatch", label: "Education" },
] as const;

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

  const result = analysis.result as unknown as JdMatchResult;

  const overallScore = Math.min(100, Math.max(0, analysis.matchScore));

  const topQuickFixes = result.quickFixes.slice(0, 3);
  const remainingQuickFixes = result.quickFixes.slice(3);

  const categoryScores = categories.map((category) => ({
    label: category.label,
    score: Math.min(100, Math.max(0, result.categoryScores[category.key])),
  }));

  const { matchedRequirements, missingRequiredRequirements, learningGaps } =
    result.requirementAnalysis;

  const hasRequirementsData =
    matchedRequirements.length > 0 ||
    missingRequiredRequirements.length > 0 ||
    learningGaps.length > 0;

  const isEntryLevel =
    /\b(intern|internship|junior|fresher|entry.level|trainee)\b/i.test(
      analysis.jobDescription.title,
    );

  const { matchedKeywords, missingRequiredSkills, missingBonusSkills } =
    result.keywordAnalysis;

  const hasKeywordData =
    matchedKeywords.length > 0 ||
    missingRequiredSkills.length > 0 ||
    missingBonusSkills.length > 0;

  const { experienceGap, educationGap, jobTitleMatch } = result.gapAnalysis;

  const hasGapAnalysisData = Boolean(
    experienceGap ||
    educationGap ||
    jobTitleMatch.jdTitle ||
    jobTitleMatch.resumeTitle ||
    jobTitleMatch.assessment,
  );

  const { contextualAlignment } = result;

  const hasContextualAlignment = contextualAlignment.length > 0;

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
            {/* Overall Score */}
            <div className="sm:min-w-40 ">
              <MatchScoreRing score={overallScore} />

              <p className="mt-1 flex justify-center text-sm text-slate-500">
                Overall Match
              </p>
            </div>

            {/* Category Scores */}
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
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Improvements */}
        {result.quickFixes.length > 0 && (
          <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Improvements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Focus on these changes to improve your resume match.
            </p>

            <ol
              start={1}
              className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700"
            >
              {topQuickFixes.map((fix, index) => (
                <li key={`${index}-${fix}`}>{fix}</li>
              ))}
            </ol>

            {remainingQuickFixes.length > 0 && (
              <details className="mt-4 border-t border-slate-200 pt-4">
                <summary className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Show {remainingQuickFixes.length} more improvements
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
        {hasRequirementsData && (
          <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Requirement Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              See how your resume matches the job requirements.
            </p>

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
        {/* Experience & Education */}
        {/* Experience & Education */}
        {hasGapAnalysisData && (
          <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <details>
              <summary className="cursor-pointer text-lg font-semibold text-slate-900">
                Experience &amp; Education
              </summary>

              <div className="mt-5 space-y-5">
                {/* Job Title Match */}
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-800">
                    Job Title Match
                  </h3>

                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-slate-500">
                        Job Description Title
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {jobTitleMatch.jdTitle || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Resume Title</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {jobTitleMatch.resumeTitle || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {jobTitleMatch.assessment && (
                    <p className="mt-4 border-t border-slate-100 pt-3 text-sm leading-6 text-slate-600">
                      {jobTitleMatch.assessment}
                    </p>
                  )}
                </div>

                {/* Experience Gap */}
                <div>
                  <h3 className="mb-2 font-semibold text-slate-800">
                    Experience Gap
                  </h3>

                  <p className="text-sm leading-6 text-slate-600">
                    {experienceGap || "No specific experience gap identified."}
                  </p>
                </div>

                {/* Education Gap */}
                <div>
                  <h3 className="mb-2 font-semibold text-slate-800">
                    Education Gap
                  </h3>

                  <p className="text-sm leading-6 text-slate-600">
                    {educationGap || "No specific education gap identified."}
                  </p>
                </div>
              </div>
            </details>
          </section>
        )}

        {/* Resume Evidence & Recommendations */}
        {hasContextualAlignment && (
          <section className="rounded-xl border border-slate-200 p-5 sm:p-6">
            <details>
              <summary className="cursor-pointer text-lg font-semibold text-slate-900">
                Resume Evidence &amp; Recommendations
              </summary>

              <p className="mt-2 text-sm text-slate-500">
                Understand how your resume supports each job requirement and
                what you can improve.
              </p>

              <div className="mt-5 space-y-4">
                {contextualAlignment.map((item, index) => (
                  <article
                    key={`${item.jdRequirement}-${index}`}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Requirement {index + 1}
                    </p>
                    <h3 className="mt-2 font-semibold text-slate-800">
                      {item.jdRequirement}
                    </h3>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-slate-700">
                        Resume Evidence
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.resumeProof ||
                          "No direct evidence identified in the resume."}
                      </p>
                    </div>

                    <div className="mt-4 rounded-md bg-indigo-50 p-3">
                      <h4 className="text-sm font-semibold text-indigo-800">
                        Recommendation
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-indigo-900">
                        {item.suggestion}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </details>
          </section>
        )}
        {/* Analysis Footer */}
        <footer className="border-t border-slate-200 pt-4 text-xs text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Analysis ID: <span className="font-mono">{analysis.id}</span>
            </p>

            <p>Generated by AI Resume Analyzer</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
