import fs from "node:fs";
import path from "node:path";
import { PageRoute } from "./routes";

const rootDir = process.cwd();

export type StaticPage = {
  title: string;
  description: string;
  styles: string;
  body: string;
};

function extractTag(html: string, pattern: RegExp) {
  return pattern.exec(html)?.[1]?.trim() ?? "";
}

function rewriteLocalLinks(markup: string) {
  return markup
    .replace(/(src|href)="assets\//g, '$1="/assets/')
    .replace(/(src|href)="\.\.\/assets\//g, '$1="/assets/')
    .replace(/href="(?:\.\.\/)?index\.html(#.*?)?"/g, (_match, hash = "") => `href="/${hash}"`)
    .replace(/href="([a-z0-9-]+)\.html(#.*?)?"/g, (_match, slug, hash = "") => `href="/${slug}${hash}"`)
    .replace(/href="insights\/([a-z0-9-]+)\.html(#.*?)?"/g, (_match, slug, hash = "") => `href="/insights/${slug}${hash}"`)
    .replace(/href="\.\.\/([a-z0-9-]+)\.html(#.*?)?"/g, (_match, slug, hash = "") => `href="/${slug}${hash}"`);
}

function stripSharedChrome(body: string) {
  return body
    .replace(/<div class="noise-overlay"><\/div>\s*/g, "")
    .replace(/<nav[\s\S]*?<\/nav>\s*/i, "")
    .replace(/<footer[\s\S]*?<\/footer>\s*/i, "")
    .replace(/<a class="float-contact"[\s\S]*?<\/a>\s*/i, "")
    .replace(/<script[\s\S]*?<\/script>\s*/gi, "");
}

export function readStaticPage(route: PageRoute): StaticPage {
  const html = fs.readFileSync(path.join(rootDir, route.file), "utf8");
  const title = extractTag(html, /<title>([\s\S]*?)<\/title>/i);
  const description = extractTag(html, /<meta name="description" content="([^"]*)"/i);
  const body = extractTag(html, /<body[^>]*>([\s\S]*?)<\/body>/i);
  const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/gi)].map((match) => match[1]).join("\n");

  return {
    title,
    description,
    styles,
    body: rewriteLocalLinks(stripSharedChrome(body))
  };
}
