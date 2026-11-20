import { createElement as h } from "react";
import { writeFileSync } from "node:fs";
import { Column, Email, Page, Heading, Text, render } from "@hyper-elements/react";

const content = h(Column, { style: { padding: 32, gap: 16 } },
    h(Heading, { level: 1 }, "Hello MobiPay"),
    h(Text, null, "My first Hyper Elements render."));

const email = await render(h(Email, { width: 600 }, content));
const page = await render(h(Page, { width: 960 }, content));

writeFileSync("hello-email.html", email.html);
writeFileSync("hello-page.html", page.html);
console.log("ok", email.html.length, page.html.length);