# AI Resume Analyzer

An AI-powered resume analyzer that helps job seekers understand how well their resumes match a target job description. Get a match score, identify missing keywords and skills, discover gaps, and receive actionable recommendations to improve your resume.

## Features

- **AI-Powered Analysis** — Compare your resume with a job description.
- **PDF Resume Upload** — Upload your resume for analysis.
- **Resume Match Score** — View an overall match score.
- **Keyword Analysis** — Identify matched keywords, missing required skills, and bonus skills.
- **Skill Gap Analysis** — Understand gaps in skills, experience, and qualifications.
- **Actionable Recommendations** — Get suggestions and quick fixes to improve your resume.
- **Detailed Results** — Review category scores, matched requirements, missing requirements, and resume evidence.
- **Authentication** — Sign up, sign in, and access protected pages.
- **Personal Dashboard** — Track total analyses, average match score, and best match score.
- **Analysis History** — View recent analyses and access detailed results.
- **Responsive UI** — A clean interface with a consistent indigo theme.

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Lucide React

### Backend and Database
- Next.js App Router and Route Handlers
- Prisma ORM 7
- PostgreSQL
- Better Auth

### AI and Data Processing
- Groq SDK
- Zod
- pdf-parse

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL
- A Groq API key

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-resume-analyzer
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual GitHub repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Add the environment variables required by your application, including your PostgreSQL connection string, Groq API key, and Better Auth configuration.

Example:

```env
DATABASE_URL="your_postgresql_connection_string"
GROQ_API_KEY="your_groq_api_key"
```

Use the exact variable names required by your existing configuration. Never commit your `.env` file or expose API keys and authentication secrets.

### 4. Set up the database

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply your existing migrations to the configured development database:

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Create an account and sign in.
2. Upload your resume in PDF format.
3. Enter the target job title and job description.
4. Optionally enter the company name.
5. Run the AI-powered resume analysis.
6. Review the match score, keyword analysis, skill gaps, and recommendations.
7. Visit the dashboard to review previous analyses.

## Project Structure

```text
ai-resume-analyzer/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── analyze/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── analyze-form.tsx
│   │   │   ├── detail-list.tsx
│   │   │   ├── keyword-group.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts
│   │   │   ├── auth/
│   │   │   │   └── [...all]/
│   │   │   │       └── route.ts
│   │   │   └── dashboard/
│   │   │       └── analyses/
│   │   │           └── route.ts
│   │   ├── dashboard/
│   │   │   ├── analysis-history.tsx
│   │   │   └── page.tsx
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── match-score-ring.tsx
│   │   └── navbar.tsx
│   ├── lib/
│   │   ├── auth/
│   │   ├── ai-analyzer.ts
│   │   ├── ai-prompt.ts
│   │   ├── ai-schema.ts
│   │   ├── groq.ts
│   │   ├── prisma.ts
│   │   ├── score.ts
│   │   └── utils.ts
│   └── proxy.ts
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── prisma.config.ts
├── README.md
└── tsconfig.json
```

This is a simplified overview of the project structure.

## Roadmap

- [ ] Add Google sign-in using Better Auth and Google OAuth.
- [ ] Complete and verify the analysis history “View More” functionality.
- [ ] Perform final testing and production deployment.

## Security and Responsible Use

- Keep API keys, database credentials, and authentication secrets private.
- Ensure users can access only their own resumes and analysis results.
- Treat AI-generated scores and recommendations as guidance, not guarantees of hiring success.

## Author

**Abdul Aziz**

- **GitHub:** [AbdulAzizDevIn](https://github.com/AbdulAzizDevIn)
- **Portfolio:** [abdulazizdev.in](https://abdulazizdev.in)
