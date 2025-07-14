/** Locale dictionary */
export type LocaleDictionary = { [key: string]: string; };
export type LocaleEnums = { [enumName: string]: { [enumValue: string]: string } };

/** Locale Error Translator */
export type LocaleValidationErrorTranslator = (error: any) => string;


/** Locale validation error translator functions */
export type LocaleValidationErrorTranslators = {
  [key: string]: LocaleValidationErrorTranslator;
};


/** 
 * Locale definition
 */
export interface LocaleDefinition {
  /** Locale name */
  readonly name: string;

  /** Does this locale belongs to a RTL language */
  readonly rtl?: boolean;

  /** Locale dictionary */
  dictionary?: LocaleDictionary;
  enums?: LocaleEnums,
  form?: {
    validation?: {
      /** Form validation error translators. */
      errors?: LocaleValidationErrorTranslators
    }
  }

  // date?: {
  //   calendars?: {
  //     [calendar: string]: {
  //       days: string[],
  //       daysShort: string[],
  //       months: string[],
  //       monthsShort: string[],
  //     }
  //   }
  // };
  // }
};


export type LocaleDefinitionExtend = {
  dictionary?: LocaleDictionary;
  enums?: LocaleEnums,
  form?: {
    validation?: {
      /** Form validation error translators. */
      errors?: LocaleValidationErrorTranslators
    }
  }
};