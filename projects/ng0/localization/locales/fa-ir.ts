import { formatNumber } from '@angular/common';
import { Locale } from '@bootkit/ng0/localization';

export const FA_IR_LOCALE = new Locale({
    name: 'fa-IR',
    rtl: true,
    dictionary: {
        ok: 'تایید',
        cancel: 'لغو',
        warning: 'هشدار',
        areYouSure: 'آیا مطمئن هستید?',
        noRecords: 'بدون رکورد',
        first: 'اولین',
        last: 'آخرین',
        next: 'بعدی',
        previous: 'قبلی',
        pageXofY: 'صفحه {0} از {1}',
    },
    form: {
        validation: {
            errors: {
                '*': (e) => 'نامعتبر',
                required: (e) => `الزامی`,
                min: (e) => `حداقل: ${formatNumber(e.min, 'fa')}`,
                max: (e) => `حداکثر: ${formatNumber(e.max, 'fa')}`,
                minlength: (e) => `حداقل ${e.requiredLength} کاراکتر`,
                maxlength: (e) => `حداکثر ${e.requiredLength} کاراکتر`,
                email: (e) => `ایمیل نامعتبر است`,
            }
        }
    }
});
