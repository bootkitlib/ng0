import { Locale } from '@bootkit/ng0/localization';

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
                required: (e) => `Required`,
                min: (e) => `Minimum value: ${e.requiredMin}`,
                max: (e) => `Maximum value: ${e.requiredMax}`,
                minlength: (e) => `Minimum length: ${e.minlength}`,
                maxlength: (e) => `Maximum length: ${e.maxlength}`,
                email: (e) => `Invalid email`,
            }
        }
    }
});
