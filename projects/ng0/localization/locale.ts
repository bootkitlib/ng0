import { LocaleDefinitionExtend, LocaleDefinition } from "./locale-definition";
import { TranslatedValidationError } from "./types";

/** Locale */
export class Locale {

  constructor(public readonly definition: LocaleDefinition) {
  }

  /** 
   * Returns the name of the locale
   * @returns The name of the locale
   */
  get name(): string {
    return this.definition.name;
  }

  /** 
   * Translates a key in the dictionary
   * @param key The key to look up
   * @param fallback Optional fallback value if the key is not found
   * @returns The translated string or the fallbackValue if not found
   */
  translate(key: string, fallback?: string): string | undefined {
    return this.definition.dictionary?.[key] ?? fallback;
  }

  /**
   * Translates an enum value 
   * @param enumName The name of the enum 
   * @param enumValue The value of the enum to translate 
   * @param nullValueKey
   * @param returnEnumAsFallback
   * @param fallbackKey
   * @returns The translated string or the enum value itself if not found 
   */

  translateEnum(enumName: string, enumValue: string | number | null | undefined, returnEnumAsFallback = true): string | undefined {
    let e = this.definition.enums?.[enumName];
    if (!e) {
      return undefined;
    }

    if (enumValue === null) {
      return e['[null]'] || e['[empty]'];
    } else if (enumValue === undefined) {
      return e['[undefined]'] || e['[empty]'];
    } else if(enumValue === '') {
      return e['empty'];
    }

    var result = e[enumValue];

    if (result) {
      return result;
    }

    var fallback = e['[?]'];
    return fallback ?? (returnEnumAsFallback ? enumValue : undefined);
  }

  /** 
 * Translates a form validation error
 * @param errorKey The key of the error to translate
 * @param error The error object
 */
  translateError(errorKey: string, error: any, fallbackMessage: string | undefined = undefined): string | undefined {
    const errors = this.definition?.form?.validation?.errors;

    if (!errors) {
      return fallbackMessage;
    }

    const translatorFunc = errors[errorKey] ?? errors['*'];
    return typeof translatorFunc === 'function' ? translatorFunc(error) : fallbackMessage;
  }

  /** 
   * Translates validation errors 
   * @param errors Validation errors object
   * @returns Array of translated validation errors
   */
  translateErrors(errors: any): TranslatedValidationError[] {
    const result: TranslatedValidationError[] = [];
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        result.push({
          key: key,
          value: errors[key],
          text: this.translateError(key, errors[key])
        });
      }
    }

    return result;
  }

  /** 
   * Translates the first error in the validation errors object 
   * @param errors Validation errors object
   * @returns TranslatedValidationError or undefined if no errors
   */
  translateFirstError(errors: any, fallbackMessage: string | undefined = undefined): TranslatedValidationError | undefined {
    const keys = Object.keys(errors);
    if (keys.length === 0) {
      return undefined;
    }

    const key = keys[0];
    const value = errors[key];
    return {
      key,
      value,
      text: this.translateError(key, value, fallbackMessage)
    };
  }

  /**
   * Clones and extends this object and returns a new Locale (without modifying this object).
   */
  extend(values?: LocaleDefinitionExtend): Locale {
    const definition = {
      name: this.definition.name,
      rtl: this.definition.rtl,
      dictionary: { ...this.definition.dictionary, ...values?.dictionary },
      enums: { ...this.definition.enums, ...values?.enums },
      form: {
        validation: {
          errors: { ...this.definition?.form?.validation?.errors, ...values?.form?.validation?.errors }
        }
      }
    };

    return new Locale(definition);
  }

  /**
 * 
 * @param date Date string or timestamp
 * @returns Formatted date string based on the locale 
 */
  formatDate(date: Date | string | number, format?: string): string {
    return date ? new Date(date).toLocaleDateString(this.definition.name, { hour: '2-digit', minute: '2-digit' }) : '';
  }
}
