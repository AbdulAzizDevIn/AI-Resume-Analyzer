import AnalyzeForm from "./analyze-form";


export default function AnalyzePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            New Analysis
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Analyze your resume
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            Upload your resume and compare it with a job description to
            understand your match, skill gaps, and improvement areas.
          </p>
        </div>

        <AnalyzeForm />
      </div>
    </main>
  );
}