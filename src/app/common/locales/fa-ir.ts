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
        hello: 'سلام',
        welcome: 'خوش آمدید',
    },
    enums: {
        Enum1: {
            1: 'One',
            'Done': 'انجام شده',
            'Failed': 'ناموفق',
            // '[?]': '⚠️ نامعلوم',
            '[empty]': 'مقدار null یا  "" یا undefined', // '' or null or undefined
            '[null]': '❌ NULL', // exactly null value
            '[undefined]': '❌ UNDEFINED' // exactly undefined value
        },
        Sexuality: {
            'Male': 'مرد',
            'Female': 'زن',
            'Other': 'سایر',
        }
    },
    form: {
        validation: {
            errors: {
            }
        }
    },
    formatters: {
        'Boolean': ['خیر', 'بله'],
        'CorrectIncorrectBoolean': ['غلط', 'صحیح'],
        'YesNoboolean': ['خیر', 'بله'],
        'TrueFalseBoolean:': ['غلط', 'درست'],
        'EnableDisableBoolean': ['غیرفعال', 'فعال'],
        'OnOffBoolean': ['خاموش', 'روشن'],
        
        'SexualityEnum': {
            'Male': 'مرد',
            'Female': 'زن',
            'Other': 'سایر'
        },
        'personFormatter1': (person: { id: number, name: string }, params: any[]) => person ? `${person.name} (ID: ${person.id})` : ''
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
