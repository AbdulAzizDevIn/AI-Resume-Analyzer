"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";
import Link from "next/link";

type AnalysisItem = {
  id: string;
  matchScore: number;
  createdAt: Date | string;
  resume: { fileName: string };
  jobDescription: {
    title: string;
    company: string | null;
  };
};

type AnalysisHistoryProps = {
  initialAnalyses: AnalysisItem[];
  initialHasMore: boolean;
};

export default function AnalysisHistory({
  initialAnalyses,
  initialHasMore,
}: AnalysisHistoryProps) {
  const [analyses, setAnalyses] = useState(initialAnalyses);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [skip, setSkip] = useState(initialAnalyses.length);

  const [error, setError] = useState<string | null>(null);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/analyses?skip=${skip}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load analyses.");
      }

      setAnalyses((prev) => [...prev, ...data.analyses]);

      setSkip((prev) => prev + data.analyses.length);
      setHasMore(data.hasMore);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis History</CardTitle>
      </CardHeader>
      <CardContent>
        {analyses.length === 0 ? (
          // Empty State
          <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 px-6 py-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-indigo-600" />

            <h3 className="mt-4 font-semibold text-slate-900">
              No analyses yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Upload your resume and compare it with a job description.
            </p>

            <Button
              className="mt-5 bg-indigo-600 text-white hover:bg-indigo-700"
              nativeButton={false}
              render={<Link href="/analyze" />}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Start Your First Analysis
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="flex flex-col justify-between gap-3 rounded-lg border-b px-3 pb-4 pt-3 transition-colors hover:bg-indigo-50/60 last:border-0 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-medium text-slate-900">
                    {analysis.jobDescription.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {analysis.jobDescription.company || "Company not specified"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Resume: {analysis.resume.fileName}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(analysis.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="border border-indigo-200 bg-indigo-50 text-indigo-700"
                  >
                    {analysis.matchScore}% match
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    render={<Link href={`/analyze/${analysis.id}`} />}
                  >
                    View Analysis
                  </Button>
                </div>
              </div>
            ))}

            {error && (
              <p role="alert" className="text-center text-sm text-red-600">
                {error}
              </p>
            )}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleLoadMore}
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  {isLoading ? "Loading..." : "View More"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
