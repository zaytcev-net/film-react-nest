export function stringifyValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Error) {
    return JSON.stringify({
      name: value.name,
      message: value.message,
      stack: value.stack,
    });
  }

  try {
    const result = JSON.stringify(value);

    return result ?? String(value);
  } catch {
    return String(value);
  }
}
