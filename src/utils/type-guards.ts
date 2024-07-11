export const isPropertyAccessible = (value: unknown): value is { [key: string]: unknown } =>
  value != null;

export const isArray = (value: unknown): value is Array<unknown> =>
  typeof value === "object" && Array.isArray(value);
