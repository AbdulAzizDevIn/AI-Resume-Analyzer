import { JdMatchResult } from "./ai-schema";

export function calculateMatchScore(result: JdMatchResult): number {
  const { hardSkillsMatch, softSkillsMatch, experienceMatch, educationMatch } =
    result.categoryScores;

  const score =
    hardSkillsMatch * 0.45 +
    softSkillsMatch * 0.15 +
    experienceMatch * 0.25 +
    educationMatch * 0.15;

  return Math.round(score);
}
