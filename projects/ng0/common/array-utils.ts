/**
 * Creates an array of numbers within a specified range.
 * @param start The starting number of the range (inclusive).
 * @param end The ending number of the range (inclusive).
 * @returns An array of numbers within the specified range.
 */
export function numberArray(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start)
}

/**
 * Deletes multiple entries from an array based on the provided indices.
 * @param array 
 * @param indices 
 * @private
 */
export function deleteEntries(array: any[], indices: number[]) {
  // Sort indices in descending order
  // This prevents index shifting issues when removing multiple items
  indices.sort((a, b) => b - a); 
  indices.forEach(index => {
    if (index >= 0 && index < array.length) {
      array.splice(index, 1);
    } else {
      throw new Error(`Index out of bounds: ${index}`);
    }
  });
}
