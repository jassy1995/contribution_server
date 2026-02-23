import type { ValidationTargets } from 'hono';
import { validator } from 'hono/validator';
import type { z } from 'zod';

const validate = (type: keyof ValidationTargets, schema: z.ZodTypeAny) => {
  return validator(type, (value, c) => {
    try {
      // Remove [] from object keys
      if (typeof value === 'object') {
        value = Object.keys(value).reduce((acc: Record<string, unknown>, key: string) => {
          if (key.includes('[]')) acc[key.replace('[]', '')] = value[key];
          else acc[key] = value[key];
          return acc;
        }, {});
      }
      return schema.parse(value);
    } catch (e: any) {
      const issues = Array.isArray(e?.issues) ? e.issues : [];
      const errors = issues.map((issue: any) => ({
        path: Array.isArray(issue.path) ? issue.path.join('.') : issue.path,
        message: issue.message,
        code: issue.code,
      }));
      return c.json(
        {
          success: false,
          message: 'Validation error',
          errors: errors.length ? errors : [{ message: e?.message || 'Invalid request' }],
        },
        400,
      );
    }
  });
};

export default validate;
