import { EN_US_LOCALE } from '@bootkit/ng0/localization/locales';

const formatNumber = (n: number) => n.toLocaleString();

export const APP_EN_US_LOCALE = EN_US_LOCALE.extend({
    dictionary: {
        ok: 'Ok',
        cancel: 'Cancel',
        warning: 'Warning',
        areYouSure: 'Are you sure?',
        noRecords: 'No records.',
        first: 'First',
        last: 'Last',
        next: 'Next',
        previous: 'Previous',
        pageXofY: 'Page {0} of {1}',
    },
    form: {
        validation: {
            errors: {
                '*': (e) => 'Invalid',
                required: (e) => `Required`,
                min: (e) => `Minimum: ${formatNumber(e.min)}`,
                max: (e) => `Maximum: ${formatNumber(e.max)}`,
                minlength: (e) => `Minimum length: ${e.requiredLength}`,
                maxlength: (e) => `Maximum length: ${e.requiredLength}`,
                email: (e) => `Invalid email`,
            }
        }
    },
    formatters: {
        'boolean': ['No', 'Yes'],
        'boolean:ActiveInactive': ['Inactive', 'Active'],
        'YesNoboolean': ['No', 'Yes'],
        'TrueFalseBoolean:': ['False', 'True'],
        'EnableDisableBoolean': ['Disabled', 'Enabled'],
        'OnOffBoolean': ['Off', 'On'],
    },
    components: {
        table: {
            noRecords: 'No records found.',
            pagingInfo: (info) => `Showingsdsd ${formatNumber(info.firstRecord)}-${formatNumber(info.lastRecord)} of ${formatNumber(info.totalRecords!)} records`
        }
    }
});
