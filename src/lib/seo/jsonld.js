/**
 * Helpers legados de serialização JSON-LD.
 * Os schemas oficiais ficam em `@/lib/schema`.
 */

/** @param {Record<string, unknown>} data */
export function toJsonLd(data) {
  return JSON.stringify(data);
}
