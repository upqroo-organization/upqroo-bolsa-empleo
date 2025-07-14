export function getEnumLabelSafe<
  T extends Record<string, string>
>(
  enumObj: T,
  key: string,
  fallback = "Unknown"
): string {
  if (key in enumObj) {
    return enumObj[key as keyof T];
  }
  return fallback;
}
