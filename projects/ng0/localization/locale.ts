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
   * @returns The translated string or the key itself if not found
   */
  translate(key: string): string {
    return this.definition.dictionary?.[key] ?? key;
  }

  /**
   * Translates an enum value 
   * @param enumName The name of the enum 
   * @param enumValue The value of the enum to translate 
   * @returns The translated string or the enum value itself if not found 
   */
  translateEnum(enumName: string, enumValue: any): string | undefined {
    if (this.definition?.enums && this.definition.enums[enumName])
      return this.definition.enums[enumName][enumValue];
    else
      return enumValue;
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
    return new Locale({
      name: this.definition.name,
      rtl: this.definition.rtl,
      dictionary: { ...this.definition.dictionary, ...values?.dictionary },
      enums: { ...this.definition.enums, ...values?.enums },
      form: {
        validation: {
          errors: { ...this.definition?.form?.validation?.errors, ...values?.form?.validation?.errors }
        }
      }
    });
  }

    /**
   * 
   * @param date Date string or timestamp
   * @returns Formatted date string based on the locale 
   */
  formatDate(date: string | number, format: string): string {
    return date ? new Date(date).toLocaleDateString(this.definition.name, { hour: '2-digit', minute: '2-digit' }) : '';
  }
}
