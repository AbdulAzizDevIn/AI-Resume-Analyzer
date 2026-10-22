import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { FileText, Sparkles, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import AnalysisHistory from "./analysis-history";



const Dashboard = async () => {


  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const analysisStats = await prisma.analysis.aggregate({
    where: { userId: session.user.id },
    _count: { id: true },
    _avg: { matchScore: true },
    _max: { matchScore: true },
  });

  const totalAnalyses = analysisStats._count.id;
  const averageMatchScore = Math.round(analysisStats._avg.matchScore ?? 0);
  const bestMatchScore = analysisStats._max.matchScore ?? 0;

  const recentAnalyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      resume: { select: { fileName: true } },
      jobDescription: {
        select: { title: true, company: true },
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your resume analyses.
            </p>
          </div>

          <Button
            nativeButton={false}
            size="lg"
            render={<Link href="/analyze" />}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>New Analysis</span>
          </Button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between  pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Analyses
              </CardTitle>

              <FileText className="h-5 w-5 text-indigo-600" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {totalAnalyses}
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Resumes analyzed so far
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between  pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Average Match Score
              </CardTitle>

              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {averageMatchScore}%
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Across your saved analyses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between  pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Best Match Score
              </CardTitle>

              <Trophy className="h-5 w-5 text-indigo-600" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {bestMatchScore}%
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Your highest resume match
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
         <AnalysisHistory initialAnalyses={recentAnalyses} initialHasMore={recentAnalyses.length < totalAnalyses} />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
