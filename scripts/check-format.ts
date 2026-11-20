import { sampleTransaction as t } from "../src/receipt/sample";
import { formatMoney, formatDate } from "../src/receipt/format";

console.log(formatMoney(t.amountMinor, t.currency));
console.log(formatMoney(t.amountMinor + t.feeMinor, t.currency));
console.log(formatDate(t.createdAt));