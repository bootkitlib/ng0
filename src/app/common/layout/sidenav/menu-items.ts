import { MenuItem } from "@bootkit/ng0/common";

export const menuItems: MenuItem[] = [
  { text: 'Home', routerLink: '/examples' },
  {
    text: 'Components',
    children: [
      { text: 'Accordion', routerLink: '/examples/components/accordion' },
      { text: 'Autocomplete', routerLink: '/examples/components/autocomplete' },
      { text: 'Breadcrumb' },
      { text: 'Backdrop', routerLink: '/examples/components/button' },
      { text: 'ButtonDirective', routerLink: '/examples/components/button' },
      { text: 'Collapse', routerLink: '/examples/components/collapse' },
      { text: 'DatePicker' },
      { text: 'Dropdown', routerLink: '/examples/components/dropdown' },
      { text: 'FormField', routerLink: '/examples/components/formfield' },
      { text: 'List', routerLink: '/examples/components/list' },
      { text: 'Modal', routerLink: '/examples/components/modal', tag: 'Updated',},
      { text: 'Offcanvas', routerLink: '/examples/components/offcanvas' },
      { text: 'Overlay', routerLink: '/examples/components/overlay' },
      { text: 'Pagination', routerLink: '/examples/components/pagination' },
      { text: 'Popover', routerLink: '/examples/components/popover' },
      { text: 'Progress', routerLink: '/examples/components/progress' },
      { text: 'Select', routerLink: '/examples/components/select' },
      { text: 'Sidenav', routerLink: '/examples/components/sidenav' },
      { text: 'Table', routerLink: '/examples/components/table' },
      { text: 'Tabs', routerLink: '/examples/components/tabs' },
      { text: 'Toast', routerLink: '/examples/components/toast' },
      { text: 'Tooltip', routerLink: '/examples/components/tooltip', tag: 'Updated', },
      { text: 'Vertical Menu', routerLink: '/examples/components/vertical-menu', tag: 'New', tagCssClass: 'text-bg-warning'  },
    ]
  },
  {
    text: 'Localization',
    routerLink: '/examples/localization',
    children: [
      { text: 'Formatters', routerLink: '/examples/localization/formatters' },
      { text: 'Locale' },
      { text: 'Localization Service' },
      { text: 'TranslatePipe' },
      { text: 'TranslateBooleanPipe' },
      { text: 'TranslateEnumPipe' },
      { text: 'LocalizePipe' },
      { text: 'LocalizeBooleanPipe' },
      { text: 'LocalizeEnumPipe' },
      { text: 'DatePipe' },
      {
        text: 'Locales',
        children: [
          { text: 'irFA' },
          { text: 'enUS' },
        ]
      }
    ]
  },
  {
    text: 'Form',
    children: [
      { text: 'NumberDirective', routerLink: '/examples/form/number-directive' },
      { text: 'FocusDirective' },
      { text: 'DisableCountdownDirective' },
      {
        text: 'Validation',
        children: [
          { text: 'ErrorsDirective' },
          { text: 'FirstErrorDirective' },
          {
            text: 'Validators',
            children: [
              { text: 'Custom' },
              { text: 'Equal With' },
              { text: 'Exact Length' },
              { text: 'File Size' },
              { text: 'URL' },
            ]
          }
        ]
      }
    ]
  },

  {
    text: 'Layouts',
    children: [
      { text: 'Layout1', routerLink: '/examples/layouts/layout1' },
    ]
  },

  {
    text: 'Data',
    children: [
      { text: 'DataSource' },
      { text: 'ArrayDataSource' },
      { text: 'AsyncDataSource' },
      { text: 'DataRequest' },
      { text: 'DateResult' },
    ]
  },
  {
    text: 'File',
    children: [
      { text: 'saveBlob' },
      { text: 'convertFileToBase64' },
      { text: 'downloadFile' },
    ]
  },
  {
    text: 'HTTP',
    children: [
      { text: 'HttpService' },
      { text: 'HttpDataRequestResolver' },
    ]
  },
  {
    text: 'Platform',
    children: [
      {
        text: 'Browser',
        children: [
          {
            text: 'IntersectionObserver',
            routerLink: '/examples/platform/browser/intersection-observer'
          },
          { text: 'ClipboardDirective' },
          { text: 'ClipboardService' },
        ]
      }
    ]
  },
  {
    text: 'Security',
    children: [
      { text: 'UserStore' },
      { text: 'ClaimDirective' },
      { text: 'GuestUserDirective' },
    ]
  },
  {
    text: 'Script',
    children: [
      { text: 'ScriptLoader' },
    ]
  },
  {
    text: 'Utils',
    children: [
      { text: 'Counters', routerLink: '/examples/utils/counter' },
    ]
  }
];
