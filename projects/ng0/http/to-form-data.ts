/**
 * Utility function to create FormData from an object.
 * The function iterates over the properties of the input object and appends them to a FormData instance.
 * It handles string, File, Blob, number, and nested object types. For nested objects, it stringifies them before appending.
 * This function is useful for preparing data to be sent in a multipart/form-data request, 
 * especially when dealing with file uploads and complex data structures.
 * @example
 * const data = {
 *   name: 'John Doe',
 *   age: 30,
 *   profilePicture: fileInput.files[0],
 *   preferences: { theme: 'dark', notifications: true }
 * };
 * const formData = toFormData(data);
 * // formData can now be sent in an HTTP request with content type 'multipart/form-data'.
 * @param data The input object containing the data to be converted into FormData. The properties of this object can be of type string, number, File, Blob, or nested objects.
 * @returns The FormData instance containing the data from the input object.
 */
export function toFormData(data: any): FormData {
    const formData = new FormData();
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const field = data[key];
            let value;

            if (typeof field === 'string' || field instanceof File || field instanceof Blob) {
                value = field;
            } else if (typeof field === 'number') {
                value = field.toString();
            } else if (typeof field === 'object') {
                value = JSON.stringify(field);
            }

            if (value) {
                formData.append(key, value);
            }
        }
    }

    return formData;
}