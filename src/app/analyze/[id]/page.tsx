import Link from "next/link";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { MatchScoreRing } from "@/components/match-score-ring";

type AnalysisPageProps = {
  params: Promise<{ id: string }>;
};

type AnalysisResult = {
  categoryScores: {
    hardSkillsMatch: number;
    softSkillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
  };
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

  const result = analysis.result as unknown as AnalysisResult;

  const overallScore = Math.min(100, Math.max(0, analysis.matchScore));

  const topQuickFixes = result.quickFixes.slice(0, 3);
  const remainingQuickFixes = result.quickFixes.slice(3);

  const categoryScores = categories.map((category) => ({
    label: category.label,
    score: Math.min(100, Math.max(0, result.categoryScores[category.key])),
  }));

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
      </div>
    </main>
  );
}
