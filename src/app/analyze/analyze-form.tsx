"use client";

import { FileText, Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyzeForm = () => {
  const [resume, setResume] = useState<File | null>(null);

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setResume(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      if (!resume) {
        return;
      }
      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("jobTitle", jobTitle);
      formData.append("company", company);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resume */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Resume
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!resume ? (
            <label
              htmlFor="resume"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <Upload className="h-5 w-5 text-indigo-600" />
              </div>

              <p className="mt-4 text-sm font-medium text-gray-900">
                Upload your resume
              </p>

              <p className="mt-1 text-sm text-gray-500">PDF files only</p>

              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResumeChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {resume.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {(resume.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                type="button"
                onClick={() => setResume(null)}
                className="ml-auto text-sm font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Job Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="jobTitle"
              className="text-sm font-medium text-gray-900"
            >
              Job Title
            </label>

            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="Frontend Developer"
              required
              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="company"
              className="text-sm font-medium text-gray-900"
            >
              Company
              <span className="ml-1 text-gray-400">(Optional)</span>
            </label>

            <input
              id="company"
              name="company"
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Example Company"
              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Job Description
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <label
              htmlFor="jobDescription"
              className="text-sm font-medium text-gray-900"
            >
              Paste the complete job description
            </label>

            <textarea
              id="jobDescription"
              name="jobDescription"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the job description here..."
              required
              rows={10}
              className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="text-xs text-gray-500">
              Include the responsibilities, requirements, and skills listed in
              the job posting.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || !resume}
          className="h-11 bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {isLoading ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </div>
    </form>
  );
};

export default AnalyzeForm;
