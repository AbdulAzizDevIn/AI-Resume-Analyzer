import {
  ArrowRight,
  Check,
  FileText,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MatchScoreRing } from "@/components/match-score-ring";

const strongMatches = ["React", "Next.js", "TypeScript", "Git"];

const missingSkills = [
  {
    label: "PostgreSQL",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  {
    label: "Testing",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "Upload your resume",
    description: "Upload your resume as a PDF.",
  },
  {
    number: "02",
    title: "Add a job description",
    description: "Paste the job you want to apply for.",
  },
  {
    number: "03",
    title: "Get AI insights",
    description: "See your match, skill gaps, and improvements.",
  },
];

const features = [
  {
    title: "Match Score",
    description: "Understand how closely your resume matches a specific job.",
  },
  {
    title: "Skill Gaps",
    description:
      "Find important skills from the job that are missing from your resume.",
  },
  {
    title: "Resume Improvements",
    description:
      "Get clear suggestions to improve your resume before applying.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              <FileText className="h-5 w-5 text-indigo-600" strokeWidth={1.7} />

              <span className="absolute -bottom-1 -right-1 rounded-[4px] bg-black px-1 py-0.5 text-[7px] font-bold leading-none text-white">
                AI
              </span>
            </div>

            <span className="text-base font-semibold tracking-[-0.03em] sm:text-lg">
              AI Resume Analyzer
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
            >
              How It Works
            </Link>

            <Link
              href="#features"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-black"
            >
              Features
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-6">
            <Link
              href="/sign-in"
              className="hidden text-sm font-medium text-gray-900 transition-colors hover:text-indigo-600 sm:block"
            >
              Login
            </Link>

            <Button
              asChild
              className="h-10 rounded-[9px] bg-black px-4 text-sm font-semibold text-white hover:bg-gray-800 sm:px-5"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-indigo-100 opacity-60 blur-3xl sm:h-72 sm:w-72" />
            <div className="absolute -right-20 top-32 h-64 w-64 rounded-full bg-violet-100 opacity-80 blur-3xl sm:h-80 sm:w-80" />
          </div>

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="max-w-2xl">
              <Badge
                variant="secondary"
                className="mb-6 rounded-full border-0 bg-indigo-50 px-3.5 py-1.5 text-xs font-medium text-indigo-900 sm:px-4 sm:py-2 sm:text-sm"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-indigo-400 sm:mr-2 sm:h-4 sm:w-4" />
                Discover Your Ideal Match
              </Badge>

              <h1 className="max-w-3xl text-[42px] font-bold leading-[1.04] tracking-[-0.055em] text-black sm:text-[52px] md:text-[58px] lg:text-[62px]">
                See how well your resume matches the job.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 tracking-[-0.01em] text-gray-600 sm:mt-7 sm:text-lg sm:leading-8 lg:text-xl">
                Upload your resume, paste a job description, and get clear
                AI-powered insights on your match, skill gaps, and resume
                improvements.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  asChild
                  className="h-12 w-full rounded-[10px] bg-indigo-600 px-6 text-base font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 sm:h-[56px] sm:w-auto sm:px-7 sm:text-[17px]"
                >
                  <Link href="/analyze" className="flex items-center">
                    <span>Analyze My Resume</span>
                    <ArrowRight className="ml-2 h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full rounded-[10px] border-gray-300 bg-white px-6 text-base font-semibold text-indigo-950 hover:bg-indigo-50 sm:h-[56px] sm:w-auto sm:px-7 sm:text-[17px]"
                >
                  <Link href="#how-it-works" className="flex items-center">
                    <span>See How It Works</span>
                    <PlayCircle className="ml-2 h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                  </Link>
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 sm:mt-6 sm:text-sm">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" />

                <span>Free to get started</span>

                <span className="mx-1 text-gray-300">•</span>

                <span>Your data stays private</span>
              </div>
            </div>

            {/* Demo Analysis Card */}
            <div className="flex w-full justify-center lg:justify-end">
              <Card className="w-full max-w-[500px] rounded-2xl border-gray-200 bg-white shadow-xl shadow-gray-100">
                <CardHeader className="border-b border-gray-200 px-5 py-5 sm:px-7 sm:py-6">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl font-semibold tracking-[-0.025em] text-gray-900 sm:text-2xl">
                      Resume Match Analysis
                    </CardTitle>

                    <Badge
                      variant="secondary"
                      className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600 sm:text-xs"
                    >
                      Demo
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-7">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Target</p>

                      <p className="mt-1 max-w-[250px] text-base font-semibold leading-[1.4] text-gray-900 sm:text-lg">
                        Frontend Developer at Example Company
                      </p>
                    </div>

                    <MatchScoreRing score={82} />
                  </div>

                  <Separator className="my-6 bg-gray-200 sm:my-7" />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                      Strong Matches
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {strongMatches.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 sm:px-3"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-7">
                    <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                      Missing Skills
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {missingSkills.map((skill) => (
                        <Badge
                          key={skill.label}
                          variant="outline"
                          className={`rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 ${skill.className}`}
                        >
                          {skill.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-3 rounded-[11px] bg-gray-50 px-3.5 py-3 sm:mt-7 sm:px-4 sm:py-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-4 w-4 text-emerald-700" />
                    </div>

                    <p className="pt-1 text-xs font-medium leading-5 text-gray-700 sm:text-sm">
                      Include TypeScript CI/CD metrics
                    </p>
                  </div>

                  <div className="mt-6 flex justify-end sm:mt-7">
                    <Link
                      href="/analyze"
                      className="flex items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 sm:text-sm"
                    >
                      View Full Analysis
                      <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="border-t border-gray-200 bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 sm:text-sm">
              The Analysis Workflow
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.045em] text-black sm:text-4xl md:text-5xl">
              See what the analysis looks like
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Turn your resume and a job description into clear, actionable
              insights.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <Card
                key={step.number}
                className="border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6 sm:p-7">
                  <span className="text-sm font-semibold tracking-wide text-indigo-600">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900 sm:text-xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-t border-gray-200 bg-gray-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 sm:text-sm">
              What You Get
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.045em] text-black sm:text-4xl md:text-5xl">
              Clear insights before you apply
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Understand what is working in your resume and where you can
              improve.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-gray-200 bg-white shadow-sm"
              >
                <CardContent className="p-6 sm:p-7">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-gray-900 sm:text-xl">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-gray-200 bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12 text-center sm:px-10 sm:py-16">
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-gray-900 sm:text-4xl">
              Ready to see where your resume stands?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Analyze your resume against a real job description and get
              actionable AI-powered feedback.
            </p>

            <div className="mt-8">
              <Button
                asChild
                className="h-12 rounded-[10px] bg-indigo-600 px-6 text-base font-semibold hover:bg-indigo-700 sm:h-[52px] sm:px-7"
              >
                <Link href="/analyze" className="flex items-center">
                  Start Your Analysis
                  <ArrowRight className="ml-2 h-4.5 w-4.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              AI Resume Analyzer
            </p>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Understand your resume. Improve your chances.
            </p>
          </div>

          <p className="text-xs text-gray-500 sm:text-sm">
            Built by Abdul Aziz • AI Resume Analyzer
          </p>
        </div>
      </footer>
    </div>
  );
}
