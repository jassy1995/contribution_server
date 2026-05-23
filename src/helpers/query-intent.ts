const SCOPED_PERIOD =
  /\b(this|last)\s+(month|year)\b|\b(january|february|march|april|may|june|july|august|september|october|november|december)\b|\b20\d{2}\b/;

const ALL_TIME_CONTRIBUTION_PATTERNS = [
  /\b(in total|so far|all time|all-time|overall|ever|grand total)\b/,
  /\btotal\b.*\b(contributed|collected|contribution)\b/,
  /\b(contributed|collected|contribution).*\b(total|so far)\b/,
  /\bhow much\b.*\b(all|every)\b.*\b(contribution|collected|contributed)\b/,
  /\bsum of all\b.*\bcontribution/,
];

/** Detects questions that should sum every record in the contributions collection. */
export const isAllTimeContributionQuery = (message: string): boolean => {
  const text = message.toLowerCase();
  if (SCOPED_PERIOD.test(text)) return false;
  return ALL_TIME_CONTRIBUTION_PATTERNS.some((pattern) => pattern.test(text));
};
