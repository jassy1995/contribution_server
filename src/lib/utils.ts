import crypto from 'node:crypto';

export const generateRandomHex = (size = 16) => {
  return crypto.randomBytes(size).toString('hex');
};

export const generateSlug = (text: string): string => {
  text = text.trim();
  text = text.toLowerCase();
  text = text.replace(/ /g, '-');
  text = text.replace(/-+/g, '-');
  text = text.replace(/[^\w-]+/g, '');
  return text;
};
export const generateOtp = () => {
  let code = '';
  do {
    code += crypto.randomBytes(3).readUIntBE(0, 3);
  } while (code.length < 6);
  return code.slice(0, 6);
};

export const generateUsername = (firstName: string, lastName?: string): string => {
  const base = lastName
    ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
    : firstName.toLowerCase();
  // Remove any non-alphanumeric characters and replace spaces/dots with underscores
  const cleanBase = base.replace(/[^a-zA-Z0-9._]/g, '').replace(/\./g, '_');
  // Add random suffix to ensure uniqueness
  const randomSuffix = generateRandomHex(3);
  return `${cleanBase}_${randomSuffix}`;
};
export const slugify = (text: string): string => {
  text = text.trim();
  text = text.toLowerCase();
  text = text.replace(/ /g, '-');
  text = text.replace(/-+/g, '-');
  text = text.replace(/[^\w-]+/g, '');
  return text;
};
