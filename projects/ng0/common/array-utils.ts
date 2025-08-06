/**
 * Creates an array of numbers within a specified range.
 * @param start The starting number of the range (inclusive).
 * @param end The ending number of the range (inclusive).
 * @returns An array of numbers within the specified range.
 */
export function numberArray(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}