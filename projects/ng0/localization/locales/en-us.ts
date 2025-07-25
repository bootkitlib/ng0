import { Locale } from '@bootkit/ng0/localization';

const formatNumber = (n: number) => n.toLocaleString();

export const EN_US_LOCALE = new Locale({
    name: 'en-US',
    rtl: false,
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
    }
});
