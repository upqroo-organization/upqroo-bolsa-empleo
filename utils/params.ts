type QueryParams = Record<string, string | number | (string | number)[] | null | undefined>;

type ArrayFormat = 'repeat' | 'comma' | 'brackets';

/**
 * Converts an object to a URL query string.
 * Arrays are encoded as specified by arrayFormat.
 *
 * @param params - Object with key-value pairs
 * @param options - Options for array formatting
 * @returns Query string (without leading '?')
 */
export function toQueryString(
  params: QueryParams,
  options: { arrayFormat?: ArrayFormat } = {}
): string {
  const { arrayFormat = 'repeat' } = options;
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (arrayFormat === 'repeat') {
        value.forEach(v => searchParams.append(key, String(v)));
      } else if (arrayFormat === 'comma') {
        searchParams.append(key, value.map(v => String(v)).join(','));
      } else if (arrayFormat === 'brackets') {
        value.forEach(v => searchParams.append(`${key}[]`, String(v)));
      }
    } else {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}
