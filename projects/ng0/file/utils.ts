
/**
 * Saves a Blob as a file in the user's browser.
 * This function is only available in browsers that support the Blob API.
 * @param blob 
 * @param fileName 
 * 
 */
export function saveBlob(blob: Blob, fileName: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Triggers downloading a file from a given URL.
 * @param url 
 * @param fileName 
 */
export function downloadFile(url: string, fileName: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Converts a File object to a Base64 string.
 * @param file The File object to convert.
 * @return A Promise that resolves to the Base64 string representation of the file.
 */
export function convertFileToBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
