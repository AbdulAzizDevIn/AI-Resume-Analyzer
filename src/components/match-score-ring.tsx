type MatchScoreRingProps = {
  score: number;
};

export function MatchScoreRing({ score }: MatchScoreRingProps) {
    const safeScore = Math.min(100, Math.max(0, score));
  return (
    <div className="relative h-24 w-24 sm:h-28 sm:w-28">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          pathLength="100"
          className="text-gray-200"
        />

        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${safeScore} ${100-safeScore} `}
          className="text-indigo-600"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-gray-900 sm:text-2xl">{safeScore}%</span>

        <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
          Match Score
        </span>
      </div>
    </div>
  );
}
