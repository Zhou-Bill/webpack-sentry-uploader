import { bar1 } from "./main";
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://f1a9cc65caa147eb8ad26c2337dfaab3@sentry.guanmai.cn/22",
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


enum ListQualityInspectionRequest_PagingField  {
  UNSPECIFIED = 0,
  /** 创建时间 */
  CREATE_TIME = 1,
  /** 计划交期 */
  DELIVERY_TIME = 2,
  /** PK */
  QUALITY_INSPECTION_ID = 3,
}

export const foo = "foo";

const bar = "bar";


console.log(foo);
console.log(bar1);