import { LocaleDefinitionExtend, LocaleDefinition } from "./locale-definition";
import { LocalizedValidationError as TranslatedValidationError } from "./types";

/** Locale */
export class Locale {
  constructor(public readonly definition: LocaleDefinition) {
  }

  get name(): string {
    return this.definition.name;
  }

  /** 
   * Looks up a key in the locale dictionary 
   */
  translate(key: string): string {
    return this.definition.dictionary[key] ?? key;
  }

  /** Translates a validation error */
  translateError(errorKey: string, error: any): string | undefined {
    const errors = this.definition?.form?.validation?.errors;
    const translatorFunc = errors ? errors[errorKey] : errors['*'];
    return typeof translatorFunc === 'function' ? translatorFunc(error) : 'Invalid';
  }

  translateEnum(enumName: string, enumValue: any): string | undefined {
    if (this.definition?.enums && this.definition.enums[enumName])
      return this.definition.enums[enumName][enumValue];
    else
      return enumValue;
  }

  /** Translates validation errors */
  translateErrors(errors: any): { [key: string]: TranslatedValidationError } {
    const result: { [key: string]: TranslatedValidationError } = {};
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        result[key] = {
          key: key,
          value: errors[key],
          text: this.translateError(key, errors[key])
        };
      }
    }

    return result;
  }

  /** Translates first validation error */
  translateFirstError(errors: any): TranslatedValidationError | undefined {
    const key = Object.keys(errors)[0];
    const value = errors[key];
    return {
      key,
      value,
      text: this.translateError(key, value)
    };
  }

  formatDate(date: string | number, format: string): string {
    return date ? new Date(date).toLocaleDateString(this.name, { hour: '2-digit', minute: '2-digit' }) : '';
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
}
