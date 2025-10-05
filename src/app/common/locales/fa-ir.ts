import { FA_IR_LOCALE } from '@bootkit/ng0/localization/locales';

const formatNumber = (n: number) => n.toLocaleString();

export const APP_FA_IR_LOCALE = FA_IR_LOCALE.extend({
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
            }
        }
    },
    formatters: {
        'boolean:Default': ['خیر', 'بله'],
        'boolean:ActiveInactive': ['غیرفعال', 'فعال'],
        'boolean:YesNo': ['خیر', 'بله'],
        'boolean:TrueFalse': ['غلط', 'درست'],
        'boolean:EnableDisable': ['غیرفعال', 'فعال'],
        'boolean:OnOff': ['خاموش', 'روشن'],
    },
    components: {
        table: {
            noRecords: 'رکوردی وجود ندارد',
            pagingInfo: (info) => `نمایش ${formatNumber(info.firstRecord)}-${formatNumber(info.lastRecord)} از ${formatNumber(info.totalRecords!)} رکورد`
        }
    },
    data: {
        logicalOperators: {
            contains: 'شامل',
            startsWith: 'شروع',
            endsWith: 'پایان',
            eq: 'مساوی',
            gt: 'بزرگتر',
            gte: 'بزرگتر یا مساوی',
            lt: 'کوچکتر',
            lte: 'کوچکتر یا مساوی',
            ne: 'مخالف',

        }
    }
});
