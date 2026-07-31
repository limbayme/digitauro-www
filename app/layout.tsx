import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { SiteChrome } from "@/components/SiteChrome";

const rootDir = process.cwd();
const criticalStyles = [
  fs.readFileSync(path.join(rootDir, "assets/css/common.css"), "utf8"),
  fs.readFileSync(path.join(rootDir, "app/globals.css"), "utf8")
].join("\n");

export const metadata: Metadata = {
  title: "数漫极光 DigitAuro",
  description: "整合流量和技术，驱动品牌全球增长。",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" }
    ],
    apple: [{ url: "/favicon.png", type: "image/png" }]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <style data-site-styles dangerouslySetInnerHTML={{ __html: criticalStyles }} />
        {/* Mark JS active before paint so .reveal can safely hide-then-reveal
            without risking permanently-invisible text on SSR failure. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
