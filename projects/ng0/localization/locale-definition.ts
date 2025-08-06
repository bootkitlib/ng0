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
  components?: {
    table?: {
      /**
       * No records found message.
       */
      noRecords?: string;

      /**
       * A format function to format the paging info.
       */
      pagingInfo?: TableComponentPagingFormatter;
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

/**
 * A function to format the paging info of a table.
 * 
 */
export type TableComponentPagingFormatter = (info: {
  /**
   * The first record in the current page.
   */
  firstRecord: number,

  /**
   * The last record in the current page.
   */
  lastRecord: number,

  /**
   * The total number of records.
   */
  totalRecords?: number,

  /**
   * The current page index.
   */
  currentPage: number
}) => string;