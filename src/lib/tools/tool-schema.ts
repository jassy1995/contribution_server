const monthYearParams = {
  month: {
    type: 'number',
    description:
      'Optional. The month as a number (1=January … 12=December). Required together with year for a single-month total. Omit when querying a full year or all-time.',
  },
  year: {
    type: 'number',
    description:
      'Optional. The four-digit year (e.g. 2026). Provide with month for a single month, or alone for a full calendar year / year-to-date. Omit both month and year for all-time totals.',
  },
};

const periodNote =
  ' Period rules: month+year = that month; year only = that full year (year-to-date if current year); omit both = all-time.';

const nairaNote =
  ' All amounts are in Nigerian Naira (NGN). Use the totalFormatted field (₦) when presenting amounts to the user.';

const tools = [
  {
    type: 'function' as const,
    name: 'get_debit_total',
    description:
      'Returns the total amount spent (sum of all debit transactions).' +
      periodNote +
      ' Use when the user asks how much was spent, disbursed, or paid out.' +
      nairaNote,
    parameters: {
      type: 'object',
      properties: monthYearParams,
      additionalProperties: false,
    },
  },
  {
    type: 'function' as const,
    name: 'get_credit_total',
    description:
      'Returns the total amount recovered or received (sum of all credit transactions).' +
      periodNote +
      ' Use when the user asks how much was recovered, received, or credited.' +
      nairaNote,
    parameters: {
      type: 'object',
      properties: monthYearParams,
      additionalProperties: false,
    },
  },
  {
    type: 'function' as const,
    name: 'get_contribution_grand_total',
    description:
      'Returns the grand total of ALL contributions ever recorded in the system (entire contributions collection, no date filter). ALWAYS use this tool when the user asks about total/overall/all-time/so far contributions without naming a specific month or year.' +
      nairaNote,
    parameters: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
  {
    type: 'function' as const,
    name: 'get_contribution_total',
    description:
      'Returns contributions collected for a specific month or calendar year only. Do NOT use for all-time or "so far" questions — use get_contribution_grand_total instead.' +
      periodNote +
      nairaNote,
    parameters: {
      type: 'object',
      properties: monthYearParams,
      additionalProperties: false,
    },
  },
  {
    type: 'function' as const,
    name: 'get_user_contribution',
    description:
      "Returns the total contribution amount for a specific member identified by their first name and last name." +
      periodNote +
      " Use when the user asks about a particular person's contribution." +
      nairaNote,
    parameters: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          description: "The member's first name.",
        },
        lastName: {
          type: 'string',
          description: "The member's last name / surname.",
        },
        ...monthYearParams,
      },
      required: ['firstName', 'lastName'],
      additionalProperties: false,
    },
  },
  {
    type: 'function' as const,
    name: 'list_contributors',
    description:
      'Returns a list of all members who made contributions, along with the amount each person contributed.' +
      periodNote +
      ' Use when the user wants to see who contributed and how much.' +
      nairaNote,
    parameters: {
      type: 'object',
      properties: monthYearParams,
      additionalProperties: false,
    },
  },
];

export default tools;
