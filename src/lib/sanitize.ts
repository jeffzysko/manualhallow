/**
 * Sanitize user text input — strips HTML tags, script injections, and trims.
 * Use before sending to DB or API.
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

/**
 * Validate and clamp text length.
 */
export function clampText(text: string, maxLength: number): string {
  const sanitized = sanitizeText(text);
  return sanitized.slice(0, maxLength);
}
