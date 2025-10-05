import { ValueFormatterFunction } from "./value-formatter";

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
  },
  data?: {
    logicalOperators?: {
      [operator: string]: string
    }
  },
  components?: {
    table?: {
      /**
       * No records found message.
       */
      noRecords?: string;

      /** 
       * Error message displayed when loading data fails. 
       */
      loadError?: string;

      /**
       * A format function to format the paging info.
       */
      pagingInfo?: TableComponentPagingFormatter;
    },
    select?: {
      placeholder?: string;
    }
  },

  formatters?: {
    // boolean?: {
    //   [booleanKind: string]: string[] // [false, true]
    // },
    // enum?: {
    //   [enumName: string]: { [enumValue: string]: string }
    // }
    // custom?: {
    [formatterName: string]: ValueFormatterFunction | string[] | {
      [value: string]: string
    }
    // },
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
  }
};

