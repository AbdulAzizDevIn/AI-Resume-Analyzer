import { z } from "zod";

export const jdMatchSchema = z.object({
  categoryScores: z.object({
    hardSkillsMatch: z.number().int().min(0).max(100),
    softSkillsMatch: z.number().int().min(0).max(100),
    experienceMatch: z.number().int().min(0).max(100),
    educationMatch: z.number().int().min(0).max(100),
  }),

  keywordAnalysis: z.object({
    matchedKeywords: z.array(z.string()),
    missingRequiredSkills: z.array(z.string()),
    missingBonusSkills: z.array(z.string()),
  }),

  requirementAnalysis: z.object({
    matchedRequirements: z.array(
      z.object({
        requirement: z.string(),
        evidence: z.string(),
      }),
    ),

    missingRequiredRequirements: z.array(
      z.object({
        requirement: z.string(),
        reason: z.string(),
      }),
    ),

    learningGaps: z.array(
      z.object({
        requirement: z.string(),
        explanation: z.string(),
      }),
    ),
  }),

  gapAnalysis: z.object({
    experienceGap: z.string().nullable(),
    educationGap: z.string().nullable(),

    jobTitleMatch: z.object({
      jdTitle: z.string(),
      resumeTitle: z.string().nullable(),
      assessment: z.string(),
    }),
  }),

  contextualAlignment: z.array(
    z.object({
      jdRequirement: z.string(),
      resumeProof: z.string().nullable(),
      suggestion: z.string(),
    }),
  ),

  quickFixes: z.array(z.string()),
});

export type JdMatchResult = z.infer<typeof jdMatchSchema>;
